import { type ComputedRef } from 'vue';
import type { BetterOmit, Expand } from '@/utils/types';
import {
  type FunctionArgs,
  type FunctionReference,
  type PaginationOptions,
  paginationOptsValidator,
  getFunctionName,
  type FunctionReturnType,
  type PaginationResult
} from 'convex/server';
import { convexToJson, type Infer, type Value } from 'convex/values';
import { useQueries } from './useQueries';
import type { MaybeRefOrGetter } from '@vueuse/core';

export type PaginatedQueryItem<Query extends PaginatedQueryReference> =
  FunctionReturnType<Query>['page'][number];

export type UsePaginatedQueryResult<Item> = {
  results: ComputedRef<Item[]>;
  loadMore: (numItems: number) => void;
} & (
  | {
      status: ComputedRef<'LoadingFirstPage'>;
      isLoading: ComputedRef<true>;
    }
  | {
      status: ComputedRef<'CanLoadMore'>;
      isLoading: ComputedRef<false>;
    }
  | {
      status: ComputedRef<'LoadingMore'>;
      isLoading: ComputedRef<true>;
    }
  | {
      status: ComputedRef<'Exhausted'>;
      isLoading: ComputedRef<false>;
    }
);

export type PaginatedQueryReference = FunctionReference<
  'query',
  'public',
  { paginationOpts: PaginationOptions },
  PaginationResult<any>
>;

export type PaginatedQueryArgs<Query extends PaginatedQueryReference> = Expand<
  BetterOmit<FunctionArgs<Query>, 'paginationOpts'>
>;

export type UsePaginatedQueryReturnType<Query extends PaginatedQueryReference> =
  UsePaginatedQueryResult<PaginatedQueryItem<Query>>;

let paginationId = 0;

function nextPaginationId(): number {
  paginationId++;
  return paginationId;
}

export function usePaginatedQuery<Query extends PaginatedQueryReference>(
  query: Query,
  args: MaybeRefOrGetter<PaginatedQueryArgs<Query>>,
  options: { initialNumItems: number }
): UsePaginatedQueryReturnType<Query> {
  if (typeof options?.initialNumItems !== 'number' || options.initialNumItems < 0) {
    throw new Error(
      `\`options.initialNumItems\` must be a positive number. Received \`${options?.initialNumItems}\`.`
    );
  }

  const createInitialState = () => {
    const id = nextPaginationId();
    return {
      query,
      id,
      maxQueryIndex: 0,
      queries: {
        0: {
          query,
          args: {
            ...args,
            paginationOpts: {
              numItems: options.initialNumItems,
              cursor: null,
              id
            }
          }
        }
      }
    };
  };
  const state = ref<{
    query: FunctionReference<'query'>;
    id: number;
    maxQueryIndex: number;
    queries: Record<
      number,
      {
        query: FunctionReference<'query'>;
        // Use the validator type as a test that it matches the args
        // we generate.
        args: { paginationOpts: Infer<typeof paginationOptsValidator> };
      }
    >;
  }>(createInitialState());

  const resultsObject = useQueries(computed(() => state.value.queries));

  const hasRecoverableError = computed(() => {
    let hasError = false;
    for (let i = 0; i <= state.value.maxQueryIndex; i++) {
      const currResult = resultsObject.value[i];
      if (currResult === undefined) {
        break;
      }

      if (currResult instanceof Error) {
        if (
          currResult.message.includes('InvalidCursor') ||
          currResult.message.includes('ArrayTooLong') ||
          currResult.message.includes('TooManyReads') ||
          currResult.message.includes('TooManyDocumentsRead') ||
          currResult.message.includes('ReadsTooLarge')
        ) {
          // `usePaginatedQueryGeneric` handles a few types of query errors:

          // - InvalidCursor: If the cursor is invalid, probably the paginated
          // database query was data-dependent and changed underneath us. The
          // cursor in the params or journal no longer matches the current
          // database query.
          // - ArrayTooLong, TooManyReads, TooManyDocumentsRead, ReadsTooLarge:
          // Likely so many elements were added to a single page they hit our limit.

          // In all cases, we want to restart pagination to throw away all our
          // existing cursors.
          console.warn(
            'usePaginatedQuery hit error, resetting pagination state: ' +
              currResult.message
          );
          hasError = true;
        }
      }
    }

    return hasError;
  });

  const unwrappedArgs = computed(() => toValue(args));
  watch(
    [
      () => hasRecoverableError.value,
      () => getFunctionName(query) !== getFunctionName(state.value.query),
      unwrappedArgs
    ],
    ([hasRecoverableError, queryHasChanged, newArgs], [, , oldArgs]) => {
      const argsHaveChanged = JSON.stringify(oldArgs) !== JSON.stringify(newArgs);

      if (hasRecoverableError || queryHasChanged || argsHaveChanged) {
        state.value = createInitialState();
      }
    }
  );

  const results = computed<{
    allPages: Value[];
    lastPage: undefined | PaginationResult<Value>;
  }>(() => {
    let lastPage = undefined;

    const allPages: Value[] = [];

    if (hasRecoverableError.value) return { allPages, lastPage };

    for (let i = 0; i <= state.value.maxQueryIndex; i++) {
      lastPage = resultsObject.value[i];
      if (lastPage === undefined) {
        break;
      }
      if (
        lastPage instanceof Error &&
        !lastPage.message.includes('InvalidCursor') &&
        !lastPage.message.includes('ArrayTooLong') &&
        !lastPage.message.includes('TooManyReads') &&
        !lastPage.message.includes('TooManyDocumentsRead') &&
        !lastPage.message.includes('ReadsTooLarge')
      ) {
        console.log('throwing');
        throw lastPage;
      }
      allPages.push(...lastPage.page);
    }
    return { allPages, lastPage };
  });

  const statusObject = computed(() => {
    const maybeLastResult = results.value.lastPage;
    if (maybeLastResult === undefined) {
      if (state.value.maxQueryIndex === 0) {
        return {
          status: 'LoadingFirstPage',
          isLoading: true
        } as const;
      } else {
        return {
          status: 'LoadingMore',
          isLoading: true
        } as const;
      }
    }
    if (maybeLastResult.isDone) {
      return {
        status: 'Exhausted',
        isLoading: false
      } as const;
    }

    return {
      status: 'CanLoadMore',
      isLoading: false
    };
  });

  const isLoadingMore = ref(false);
  watchEffect(() => {
    const { lastPage } = results.value;
    if (lastPage === undefined) return;
    isLoadingMore.value = false;
  });

  const loadMore = (numItems: number) => {
    console.log(isLoadingMore.value);
    if (isLoadingMore.value) return;

    const { lastPage } = results.value;
    if (lastPage === undefined) return;
    if (lastPage.isDone) return;

    isLoadingMore.value = true;

    state.value.maxQueryIndex++;
    state.value.queries[state.value.maxQueryIndex] = {
      query: state.value.query,
      args: {
        ...unwrappedArgs.value,
        paginationOpts: {
          numItems,
          cursor: lastPage.continueCursor,
          id: state.value.id
        }
      }
    };
  };

  return {
    results: computed(() => results.value.allPages),
    status: computed(() => statusObject.value.status),
    isLoading: computed(() => statusObject.value.isLoading),
    loadMore
  } as UsePaginatedQueryReturnType<Query>;
}

import type { Ref } from 'vue';
import type { Value } from 'convex/values';
import type { QueryReference } from './useQuery';
import type { QueryJournal } from 'convex/browser';

import type { Watch } from '@/plugins/convex';
import { QueriesObserver } from '@/utils/convex/QueriesObserver';
import type { FunctionReference } from 'convex/server';

export function useQueries(
  queries: Ref<RequestForQueries>
): Record<string, any | undefined | Error> {
  const convex = useConvex();

  const createWatch = (
    query: QueryReference,
    args: Record<string, Value>,
    journal?: QueryJournal
  ) => {
    return convex.watchQuery(query, args, { journal });
  };

  return useQueriesHelper(queries, createWatch);
}

export type CreateWatch = (
  query: QueryReference,
  args: Record<string, Value>,
  journal?: QueryJournal
) => Watch<Value>;

/**
 * Internal version of `useQueriesGeneric` that is exported for testing.
 */
export function useQueriesHelper(
  queries: Ref<RequestForQueries>,
  createWatch: CreateWatch
): Record<string, any | undefined | Error> {
  const observer = new QueriesObserver(createWatch);

  watchEffect(() => {
    if (observer.createWatch !== createWatch) {
      observer.setCreateWatch(createWatch);
    }
  });

  watchEffect(() => {
    observer.setQueries(queries.value);
  });

  onUnmounted(() => {
    observer.destroy();
  });

  const result = ref(observer.getCurrentQueries());

  observer.subscribe(() => {
    result.value = observer.getCurrentQueries();
  });

  return result;
}

export type RequestForQueries = Record<
  string,
  {
    query: FunctionReference<'query'>;
    args: Record<string, Value>;
  }
>;

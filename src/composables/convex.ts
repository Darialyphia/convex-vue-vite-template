import {
  type FunctionReference,
  type OptionalRestArgs,
  makeFunctionReference
} from 'convex/server';
import type { Ref } from 'vue';
import { CONVEX_INJECTION_KEY, CONVEX_AUTH_INJECTION_KEY } from '@/plugins/convex';
import type { OptimisticUpdate } from 'convex/browser';

export const useConvex = () => {
  return useSafeInject(CONVEX_INJECTION_KEY);
};

export const useConvexAuth = () => {
  return useSafeInject(CONVEX_AUTH_INJECTION_KEY);
};

export type QueryReference = FunctionReference<'query'>;
export const useQuery = <Query extends QueryReference>(
  query: Query,
  ...args: OptionalRestArgs<Query>
): Ref<Query['_returnType'] | undefined> => {
  const convex = useConvex();

  const queryReference =
    typeof query === 'string' ? makeFunctionReference<'query', any, any>(query) : query;

  const { onUpdate, localQueryResult } = convex.watchQuery(queryReference, ...args);
  const data = ref(localQueryResult());

  const unsub = onUpdate(() => {
    const newVal = localQueryResult();

    data.value = newVal;
  });

  onUnmounted(unsub);

  return data;
};

export const useSuspenseQuery = <Query extends QueryReference>(
  query: Query,
  ...args: OptionalRestArgs<Query>
): Promise<Ref<Query['_returnType']>> => {
  const convex = useConvex();

  const queryReference =
    typeof query === 'string' ? makeFunctionReference<'query', any, any>(query) : query;

  return new Promise<Ref<Query['_returnType']>>((res, rej) => {
    const { onUpdate, localQueryResult } = convex.watchQuery(queryReference, ...args);
    const data = ref(localQueryResult());

    const unsub = onUpdate(() => {
      try {
        const newVal = localQueryResult();
        data.value = newVal;
        res(data);
      } catch (err) {
        rej(err);
      }
    });
    if (data.value) res(data);

    onUnmounted(unsub);
  });
};

export type MutationReference = FunctionReference<'mutation'>;
export function useMutation<Mutation extends MutationReference>(
  mutation: Mutation,
  { optimisticUpdate }: { optimisticUpdate?: OptimisticUpdate<Mutation['_args']> } = {}
) {
  const convex = useConvex();

  const mutationReference =
    typeof mutation === 'string'
      ? makeFunctionReference<'mutation', any, any>(mutation)
      : mutation;

  const isLoading = ref(false);

  return {
    isLoading,
    mutate: async (args?: Mutation['_args']): Promise<Mutation['_returnType']> => {
      try {
        isLoading.value = true;
        return await convex.mutation(mutationReference as Mutation, args, {
          optimisticUpdate
        });
      } finally {
        isLoading.value = false;
      }
    }
  };
}

export type ActionReference = FunctionReference<'action'>;
export function useAction<Action extends ActionReference>(action: Action) {
  const convex = useConvex();

  const actionReference =
    typeof action === 'string'
      ? makeFunctionReference<'action', any, any>(action)
      : action;

  const isLoading = ref(false);

  return {
    isLoading,
    execute: async (args?: Action['_args']): Promise<Action['_returnType']> => {
      try {
        isLoading.value = true;
        return await convex.action(actionReference, args);
      } finally {
        isLoading.value = false;
      }
    }
  };
}

import type { OptimisticUpdate } from 'convex/browser';
import { makeFunctionReference, type FunctionReference } from 'convex/server';

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

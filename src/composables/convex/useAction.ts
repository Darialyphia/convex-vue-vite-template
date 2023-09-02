import { makeFunctionReference, type FunctionReference } from 'convex/server';

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

import {
  makeFunctionReference,
  type FunctionReference,
  type OptionalRestArgs
} from 'convex/server';
import { onUnmounted, ref, type Ref } from 'vue';
import { useConvex } from './useConvex';

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

import type { MaybeRefOrGetter } from '@vueuse/core';
import {
  makeFunctionReference,
  type FunctionReference,
  type OptionalRestArgs
} from 'convex/server';

export type QueryReference = FunctionReference<'query'>;

export const useQuery = <Query extends QueryReference>(
  query: Query,
  args: MaybeRefOrGetter<OptionalRestArgs<Query>>
): Ref<Query['_returnType'] | undefined> => {
  const convex = useConvex();

  const queryReference =
    typeof query === 'string' ? makeFunctionReference<'query', any, any>(query) : query;

  const data = ref<Query['_returnType'] | undefined>();

  watchEffect(onCleanup => {
    const { onUpdate, localQueryResult } = convex.watchQuery(
      queryReference,
      ...toValue(args)
    );
    data.value = localQueryResult();

    const unsub = onUpdate(() => {
      const newVal = localQueryResult();

      data.value = newVal;
    });

    onCleanup(unsub);
  });

  return data;
};

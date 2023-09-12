import { makeFunctionReference, type OptionalRestArgs } from 'convex/server';
import type { QueryReference } from './useQuery';
import type { MaybeRefOrGetter } from '@vueuse/core';

export const useSuspenseQuery = <Query extends QueryReference>(
  query: Query,
  args: MaybeRefOrGetter<OptionalRestArgs<Query>>
): Promise<Ref<Query['_returnType']>> => {
  const convex = useConvex();

  const queryReference =
    typeof query === 'string' ? makeFunctionReference<'query', any, any>(query) : query;

  return new Promise<Ref<Query['_returnType']>>((res, rej) => {
    const data = ref();

    watchEffect(onCleanup => {
      const { onUpdate, localQueryResult } = convex.watchQuery(
        queryReference,
        ...toValue(args)
      );
      const initialValue = localQueryResult();
      data.value = initialValue;

      const unsub = onUpdate(() => {
        try {
          const newVal = localQueryResult();
          data.value = newVal;
          res(data);
        } catch (err) {
          rej(err);
        }
      });

      if (initialValue) res(data);

      onCleanup(unsub);
    });
  });
};

import { makeFunctionReference, type OptionalRestArgs } from 'convex/server';
import type { QueryReference } from './useQuery';
import { toValue, type MaybeRefOrGetter } from '@vueuse/core';
import { useConvex } from '../convex';
import { type Ref, ref, watchEffect } from 'vue';

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
      data.value = localQueryResult();

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

      onCleanup(unsub);
    });
  });
};

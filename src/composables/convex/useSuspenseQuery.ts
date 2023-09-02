import { makeFunctionReference, type OptionalRestArgs } from 'convex/server';
import type { QueryReference } from './useQuery';
import { onUnmounted, ref, type Ref } from 'vue';
import { useConvex } from './useConvex';

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

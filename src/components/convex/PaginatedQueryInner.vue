<script setup lang="ts" generic="TFunc extends PaginatedQueryReference">
import { api } from '@/api';
import type {
  PaginatedQueryArgs,
  PaginatedQueryReference
} from '@/composables/convex/usePaginatedQuery';

const { query, args, numItems } = defineProps<{
  query: (_api: typeof api) => TFunc;
  args: PaginatedQueryArgs<TFunc>;
  numItems: number;
}>();

const {
  results: data,
  status,
  isLoading,
  loadMore
} = usePaginatedQuery(query(api), args, { initialNumItems: numItems });

const slots = useSlots();
</script>

<template>
  <slot
    v-if="isLoading && status === 'LoadingFirstPage'"
    name="loading"
    :status="status"
    :load-more="(num: number = numItems) => loadMore(num)"
  >
    <div class="center">
      loading slot
      <UiSpinner />
    </div>
  </slot>

  <slot
    v-else
    :data="data"
    :status="status"
    :load-more="(num: number = numItems) => loadMore(num)"
  />
</template>

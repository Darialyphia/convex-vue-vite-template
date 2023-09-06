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
} = usePaginatedQuery(query(api), () => args, { initialNumItems: numItems });

const canLoadMore = computed(() => status.value === 'CanLoadMore');
const isLoadingMore = computed(() => status.value === 'LoadingMore');
const isDone = computed(() => status.value === 'Exhausted');
const isEmpty = computed(() => !isLoading.value && !data.value.length);
</script>

<template>
  <slot
    v-if="isLoading && status === 'LoadingFirstPage'"
    name="loading"
    :status="status"
    :is-loading-more="isLoadingMore"
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
    :is-loading-more="isLoadingMore"
    :can-load-more="canLoadMore"
    :is-done="isDone"
    :is-empty="isEmpty"
    :load-more="(num: number = numItems) => loadMore(num)"
  />
</template>

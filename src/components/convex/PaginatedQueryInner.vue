<script setup lang="ts" generic="TFunc extends PaginatedQueryReference">
import { api } from '@/api';
import {
  usePaginatedQuery,
  type PaginatedQueryArgs,
  type PaginatedQueryReference
} from '@/composables/convex/usePaginatedQuery';
import { useSlots } from 'vue';

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
</script>

<template>
  <slot
    v-if="isLoading && status === 'LoadingFirstPage'"
    name="loading"
    :status="status"
    :load-more="(num: number = numItems) => loadMore(num)"
  >
    <div class="center">Loading...</div>
  </slot>

  <slot
    v-else
    :data="data"
    :status="status"
    :load-more="(num: number = numItems) => loadMore(num)"
  />
</template>

<script setup lang="ts" generic="TFunc extends PaginatedQueryReference">
import { api } from '@/api';
import type {
  PaginatedQueryArgs,
  PaginatedQueryReference
} from '@/composables/convex/usePaginatedQuery';
import type { Nullable } from '@/utils/types';

const {
  query,
  args,
  numItems,
  propagateError = false
} = defineProps<{
  query: (_api: typeof api) => TFunc;
  args: PaginatedQueryArgs<TFunc>;
  numItems: number;
  propagateError?: boolean;
}>();

const emit = defineEmits<{
  error: [Error];
}>();

const error = ref<Nullable<string>>();
onErrorCaptured(err => {
  error.value = err.message;
  emit('error', err);
  return propagateError;
});

const clearError = () => {
  error.value = null;
};
</script>

<template>
  <slot v-if="error" name="error" v-bind="{ error, clearError }">
    <div class="center gap-3">
      Looks like something went wrong.
      <pre class="p-3 bg-surface-2">{{ error }}</pre>
      <UiButton @click="clearError">Retry</UiButton>
    </div>
  </slot>

  <PaginatedQueryInner v-else :query="query" :args="args as any" :num-items="numItems">
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </PaginatedQueryInner>
</template>

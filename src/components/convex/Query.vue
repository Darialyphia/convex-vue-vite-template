<script setup lang="ts" generic="TData, TArgs extends DefaultFunctionArgs">
import type { Nullable } from '@/utils/types';
import type { DefaultFunctionArgs, FunctionReference } from 'convex/server';
import { api } from '@/api';
import { ref, onErrorCaptured, computed } from 'vue';

import QueryInner from './QueryInner.vue';

type QueryFunc = FunctionReference<'query', 'public', TArgs, TData>;

const {
  query,
  args,
  propagateError = false
} = defineProps<{
  query: (_api: typeof api) => QueryFunc;
  args: QueryFunc['_args'];
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

// Typescript being pepega, <QueryInner /> is only used internally so it's fine
const anyArgs = computed(() => [args] as any);
</script>

<template>
  <slot v-if="error" name="error" v-bind="{ error, clearError }">
    <div class="center gap-3">
      Looks like something went wrong.
      <pre>{{ error }}</pre>
      <button @click="clearError">Retry</button>
    </div>
  </slot>

  <Suspense v-else>
    <template #fallback>
      <slot name="loading">
        <div>Loading...</div>
      </slot>
    </template>

    <QueryInner :query="query" :args="anyArgs">
      <template #default="{ data }">
        <slot :data="data" />
      </template>
    </QueryInner>
  </Suspense>
</template>

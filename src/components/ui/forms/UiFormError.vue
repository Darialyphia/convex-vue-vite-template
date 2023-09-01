<script setup lang="ts">
import type { Nullable } from '@/utils/types';

const { error, isAlwaysVisible = true } = defineProps<{
  error?: Nullable<boolean | string>;
  isAlwaysVisible?: boolean;
}>();
</script>

<template>
  <div class="ui-form-error">
    <transition appear>
      <div v-if="error" class="flex gap-1 items-start">
        <UiIcon icon="mdi-alert" />
        {{ error }}
      </div>
    </transition>
  </div>
</template>

<style scoped lang="postcss">
.ui-form-error {
  gap: var(--size-2);
  min-height: v-bind('isAlwaysVisible ? "var(--size-5" : 0');
  color: var(--error);
}

.v-enter-active,
.v-leave-active {
  transition: all 0.3s;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>

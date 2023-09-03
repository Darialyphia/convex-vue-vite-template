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
@layer components {
  .ui-form-error {
    --_error-bg: var(--error-bg, transparent);
    --_error-color: var(--error-color, var(--error));

    gap: var(--size-2);
    min-height: v-bind('isAlwaysVisible ? "var(--size-5" : 0');
    color: var(--_error-color);
    background-color: var(--_error-bg);
  }

  .v-enter-active,
  .v-leave-active {
    transition: all 0.3s;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }

  .v-enter-from {
    transform: translateX(calc(-1 * var(--size-3)));
  }
}
</style>

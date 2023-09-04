<script setup lang="ts">
import type { ThemeProps } from '@/composables/useStyles';
import type { Nullable } from '@/utils/types';

const {
  error,
  isAlwaysVisible = true,
  theme
} = defineProps<
  ThemeProps<'bg' | 'color'> & {
    error?: Nullable<boolean | string>;
    isAlwaysVisible?: boolean;
  }
>();

const styles = useStyles(
  {
    prefix: 'ui-form-error',
    config: {
      bg: 'transparent',
      color: 'error'
    }
  },
  () => theme
);
</script>

<template>
  <div class="ui-form-error" :styles="styles">
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
    gap: var(--size-2);
    min-height: v-bind('isAlwaysVisible ? "var(--size-5" : 0');
    color: var(--ui-form-error-color);
    background-color: var(--ui-form-error-bg);
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

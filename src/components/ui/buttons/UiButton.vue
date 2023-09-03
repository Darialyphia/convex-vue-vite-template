<script setup lang="ts">
import type { ButtonProps } from './UiButtonBase.vue';

const props = defineProps<ButtonProps>();
</script>

<template>
  <UiButtonBase v-bind="props" class="ui-button">
    <slot />
  </UiButtonBase>
</template>

<style scoped lang="postcss">
@layer components {
  .ui-button {
    --button-color: var(--text-on-primary);
    --button-bg: var(--primary);
    --button-hover-color: var(--text-on-primary);
    --button-hover-bg: var(--primary-hover);

    @media (hover: hover) and (pointer: fine) {
      &:hover:not(:disabled) {
        --button-bg: var(--button-hover-bg);
        --button-color: var(--button-hover-color);
      }
    }
  }
}
</style>

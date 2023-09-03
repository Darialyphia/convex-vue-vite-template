<script setup lang="ts">
import type { ButtonProps } from './UiButtonBase.vue';

const props = defineProps<ButtonProps>();
</script>

<template>
  <UiButtonBase v-bind="props" class="ui-button-ghost">
    <slot />
  </UiButtonBase>
</template>

<style scoped lang="postcss">
@layer components {
  .ui-button-ghost {
    --button-color: inherit;

    &:disabled {
      --button-color: var(--text-disabled);
    }

    @media (hover: hover) and (pointer: fine) {
      &:hover:not(:disabled) {
        --button-bg: hsl(var(--gray-10-hsl) / 0.05);
        html.dark & {
          --button-bg: hsl(var(--blue-7-hsl) / 0.25);
        }
      }
    }
  }
}
</style>

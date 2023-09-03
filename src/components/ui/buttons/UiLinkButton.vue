<script setup lang="ts">
import type { ButtonProps } from './UiButtonBase.vue';

const props = defineProps<ButtonProps>();
</script>

<template>
  <UiButtonBase v-bind="props" class="ui-link-button">
    <slot />
  </UiButtonBase>
</template>

<style scoped lang="postcss">
@import 'open-props/media';

@layer components {
  .ui-link-button {
    --button-color: inherit;

    &:disabled {
      --button-color: var(--text-disabled);
    }

    @media (--mouse) {
      &:hover:not(:disabled) {
        text-decoration: underline;
      }
    }
  }
}
</style>

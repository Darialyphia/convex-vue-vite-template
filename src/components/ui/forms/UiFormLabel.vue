<script setup lang="ts">
import { type ThemeProps } from '@/composables/useStyles';

const props = defineProps<ThemeProps<'weight' | 'color' | 'size'> & { for: string }>();

const styles = useStyles(
  {
    config: {
      color: '[inherit]',
      size: '[inherit]',
      weight: 'font-weight-5'
    },
    prefix: 'ui-form-label'
  },
  () => props.theme
);
</script>

<template>
  <label :for="props.for" :style="styles">
    <slot />
  </label>
</template>

<style scoped>
@layer components {
  label {
    font-size: var(--ui-form-label-size);
    font-weight: var(--ui-form-label-weight);
    color: var(--ui-form-label-color);
  }
}
</style>

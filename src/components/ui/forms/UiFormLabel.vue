<script setup lang="ts">
const props = defineProps<{ for: string }>();
</script>

<template>
  <label :for="props.for">
    <slot />
  </label>
</template>

<style scoped>
@layer components {
  label {
    --_label-weight: var(--label-weight, var(--font-weight-5));
    --_label-color: var(--label-color, inherit);
    --_label-size: var(--label-size, inherit);

    font-size: var(--_label-size);
    font-weight: var(--_label-weight);
    color: var(--_label-color);
  }
}
</style>

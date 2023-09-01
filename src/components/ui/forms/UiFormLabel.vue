<script setup lang="ts">
const props = defineProps<{ for: string }>();
</script>

<template>
  <label :for="props.for">
    <slot />
  </label>
</template>

<style scoped>
label {
  font-weight: var(--font-weight-5);
}
</style>

<script setup lang="ts">
const isDarkMode = useLocalStorage<string>('dark-mode', null);

const vModel = computed({
  get() {
    return JSON.parse(isDarkMode.value ?? 'false');
  },
  set(val: any) {
    isDarkMode.value = val;
  }
});

watchEffect(() => {
  if (vModel.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
});
</script>

<template>
  <UiSwitch v-model="vModel" aria-label="Theme">
    <template #on><UiIcon icon="ph:moon-fill" class="icon" /></template>
    <template #off><UiIcon icon="ph:sun-fill" class="icon" /></template>
  </UiSwitch>
</template>

<style scoped lang="postcss">
.icon {
  font-size: var(--font-size-3);
}
</style>

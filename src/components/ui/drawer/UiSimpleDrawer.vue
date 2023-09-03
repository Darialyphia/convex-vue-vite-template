<script setup lang="ts">
const { id, title } = defineProps<{
  id: string;
  title: string;
}>();

const isOpened = defineModel('isOpened', { required: true });
const slots = useSlots();
</script>

<template>
  <UiDrawer :id="id" v-model:is-opened="isOpened">
    <template v-if="slots.trigger" #trigger="triggerProps">
      <slot name="trigger" v-bind="triggerProps" />
    </template>

    <UiDrawerHeader>{{ title }}</UiDrawerHeader>

    <UiDrawerContent><slot /></UiDrawerContent>
  </UiDrawer>
</template>

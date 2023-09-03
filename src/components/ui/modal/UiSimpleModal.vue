<script setup lang="ts">
const { id, title } = defineProps<{
  id: string;
  title: string;
}>();

const isOpened = defineModel('isOpened', { required: true });
const slots = useSlots();
</script>

<template>
  <UiModal :id="id" v-model:is-opened="isOpened">
    <template v-if="slots.trigger" #trigger="triggerProps">
      <slot name="trigger" v-bind="triggerProps" />
    </template>

    <UiModalHeader>{{ title }}</UiModalHeader>

    <UiModalContent><slot /></UiModalContent>
  </UiModal>
</template>

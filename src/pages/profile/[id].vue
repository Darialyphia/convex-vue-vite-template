<script setup lang="ts">
definePage({
  name: 'Profile',
  meta: {
    needsAuth: true
  }
});

const { user } = useAuth0();

const isModalOpened = ref(false);
</script>
<template>
  <main class="container surface">
    <h2>Your profile</h2>

    <pre>{{ user }}</pre>

    <UiModal id="test-modal" v-model:is-opened="isModalOpened">
      <template #trigger="triggerProps">
        <UiButton v-bind="triggerProps">Toggle modal</UiButton>
      </template>
      <UiModalHeader>Test Modal</UiModalHeader>

      <UiModalContent>The content of the modal</UiModalContent>
    </UiModal>
  </main>
</template>

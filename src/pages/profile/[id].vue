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

    <UiSimpleModal id="test-modal" v-model:is-opened="isModalOpened" title="Test Modal">
      <template #trigger="triggerProps">
        <UiButton v-bind="triggerProps">Toggle modal</UiButton>
      </template>

      The content of the modal
    </UiSimpleModal>
  </main>
</template>

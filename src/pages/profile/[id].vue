<script setup lang="ts">
definePage({
  name: 'Profile',
  meta: {
    needsAuth: true
  }
});

const { user } = useAuth0();
</script>
<template>
  <main class="container surface">
    <h2>Your profile</h2>

    <pre>{{ user }}</pre>
  </main>
</template>

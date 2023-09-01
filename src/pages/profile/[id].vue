<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue';
import { definePage } from 'vue-router/auto';

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

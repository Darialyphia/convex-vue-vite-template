<script setup lang="ts">
const { loginWithRedirect, user, isAuthenticated, logout } = useAuth0();

const location = window.location;
</script>
<template>
  <header class="container">
    <button v-if="!isAuthenticated" @click="loginWithRedirect()">Log in</button>
    <template v-else>
      <pre>{{ user }}</pre>
      <button @click="logout({ logoutParams: { returnTo: location.origin } })">
        Log out
      </button>
    </template>
  </header>
  <RouterView v-slot="{ route, Component }">
    <Suspense>
      <component :is="Component" :key="route.path" />

      <template #fallback>
        <div>Loading...</div>
      </template>
    </Suspense>
  </RouterView>
</template>

<script setup lang="ts">
const { loginWithRedirect, user, isAuthenticated, logout } = useAuth0();

const location = window.location;
</script>
<template>
  <header class="container flex gap-3">
    <button v-if="!isAuthenticated" @click="loginWithRedirect()">Log in</button>
    <template v-else>
      Welcome back, {{ user?.nickname }}
      <button @click="logout({ logoutParams: { returnTo: location.origin } })">
        Log out
      </button>
    </template>

    <DarkModeToggle class="ml-auto" />
  </header>
  <RouterView v-slot="{ Component }">
    <template v-if="Component">
      <Suspense>
        <component :is="Component"></component>

        <template #fallback>
          <main class="container">Loading...</main>
        </template>
      </Suspense>
    </template>
  </RouterView>
</template>

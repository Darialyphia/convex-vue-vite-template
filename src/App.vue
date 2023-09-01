<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue';
import { useConvexAuth } from '@/composables/convex';

const { loginWithRedirect, user, logout } = useAuth0();

const { isAuthenticated } = useConvexAuth();

const location = window.location;
</script>
<template>
  <header class="container">
    <h1><RouterLink :to="{ name: 'Home' }">Super Duper Todo-list</RouterLink></h1>
    <button v-if="!isAuthenticated" class="ml-auto" @click="loginWithRedirect()">
      Log in
    </button>
    <template v-else>
      <span class="ml-auto">
        <RouterLink :to="{ name: 'Profile', params: { id: user!.sub! } }">
          {{ user?.nickname }}
        </RouterLink>
      </span>
      <button @click="logout({ logoutParams: { returnTo: location.origin } })">
        Log out
      </button>
    </template>
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

<style scoped>
header {
  display: flex;
  align-items: center;
}
</style>

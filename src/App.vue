<script setup lang="ts">
const { loginWithRedirect, user, logout } = useAuth0();

const { isAuthenticated } = useConvexAuth0Provider();

const location = window.location;
</script>
<template>
  <header class="container">
    <UiButton v-if="!isAuthenticated" @click="loginWithRedirect()">Log in</UiButton>
    <template v-else>
      Welcome back, {{ user?.nickname }}
      <UiButton @click="logout({ logoutParams: { returnTo: location.origin } })">
        Log out
      </UiButton>
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

<style scoped>
header {
  display: flex;
  gap: var(--size-3);
  align-items: center;

  margin-bottom: var(--size-5);
  padding-block: var(--size-3);
}
</style>

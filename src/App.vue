<script setup lang="ts">
const { loginWithRedirect, user, logout } = useAuth0();

const { isAuthenticated, isLoading } = useConvexAuth();

const location = window.location;

const isReady = ref(false);
until(isLoading)
  .not.toBe(true)
  .then(() => {
    isReady.value = true;
  });
</script>
<template>
  <header class="container">
    <h1><RouterLink :to="{ name: 'Home' }">Super Duper Todo-list</RouterLink></h1>
    <UiButton v-if="!isAuthenticated" class="ml-auto" @click="loginWithRedirect()">
      Log in
    </UiButton>
    <template v-else>
      <span class="ml-auto">
        <RouterLink
          v-slot="{ navigate, href }"
          :to="{ name: 'Profile', params: { id: user!.sub! } }"
          custom
        >
          <UiLinkButton :href="href" @click="navigate">
            {{ user?.nickname }}
          </UiLinkButton>
        </RouterLink>
      </span>
      <UiButton @click="logout({ logoutParams: { returnTo: location.origin } })">
        Log out
      </UiButton>
    </template>

    <DarkModeToggle />
  </header>

  <main v-if="!isReady" class="center surface">
    <p>Authenticating...</p>
    <UiSpinner size="xl" />
  </main>

  <RouterView v-else v-slot="{ Component }">
    <template v-if="Component">
      <Suspense>
        <component :is="Component"></component>

        <template #fallback>
          <main class="container">Loading...</main>
        </template>
      </Suspense>
    </template>
  </RouterView>

  <ServiceWorkerPrompt />
</template>

<style scoped>
header {
  display: flex;
  gap: var(--size-3);
  align-items: center;

  margin-bottom: var(--size-5);
  padding-block: var(--size-3);
}

h1 {
  font-size: var(--font-size-4);
}
</style>

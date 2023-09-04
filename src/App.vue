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

const MenuContent = createReusableTemplate();
const isMenuOpened = ref(false);
</script>
<template>
  <header class="container lt-lg:p-inline-3">
    <MenuContent.define>
      <UiLinkButton v-if="!isAuthenticated" @click="loginWithRedirect()">
        Log in
      </UiLinkButton>
      <template v-else>
        <RouterLink
          v-slot="{ navigate, href }"
          :to="{ name: 'Profile', params: { id: user!.sub! } }"
          custom
        >
          <UiLinkButton :href="href" @click="navigate">
            {{ user?.nickname }}
          </UiLinkButton>
        </RouterLink>
        <UiLinkButton @click="logout({ logoutParams: { returnTo: location.origin } })">
          Log out
        </UiLinkButton>
      </template>
      <DarkModeToggle />
    </MenuContent.define>
    <h1><RouterLink :to="{ name: 'Home' }">Super Duper Todo-list</RouterLink></h1>

    <nav>
      <MenuContent.reuse />
    </nav>

    <UiSimpleDrawer id="header-menu" v-model:is-opened="isMenuOpened" title="Menu">
      <template #trigger="triggerProps">
        <UiIconButton
          class="md:hidden ml-auto"
          v-bind="triggerProps"
          title="open menu"
          icon="octicon:three-bars"
          :theme="{ size: 'font-size-5' }"
        />
      </template>
      <MenuContent.reuse />
    </UiSimpleDrawer>
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

nav {
  display: flex;
  align-items: center;
  margin-left: auto;

  @screen lt-md {
    display: none;
  }
}
h1 {
  font-size: var(--font-size-4);
}
</style>

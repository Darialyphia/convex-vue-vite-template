<script setup lang="ts">
definePage({
  name: 'Home'
});

const { loginWithRedirect } = useAuth0();
const { isAuthenticated, isLoading } = useConvexAuth();
</script>

<template>
  <main class="container space-y-3">
    <section class="surface">
      <Suspense>
        <div v-if="isLoading" class="center">
          <UiSpinner size="lg" />
        </div>

        <div v-else-if="!isAuthenticated">
          You must be logged in to see your todos
          <UiButton :is-loading="isLoading" @click="loginWithRedirect">Login</UiButton>
        </div>

        <TodoList v-else />
        <template #fallback><p>Loading todos...</p></template>
      </Suspense>
    </section>

    <section class="surface">
      <AddTodoForm />
    </section>
  </main>
</template>

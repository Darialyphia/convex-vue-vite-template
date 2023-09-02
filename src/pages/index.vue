<script setup lang="ts">
definePage({
  name: 'Home'
});

const { loginWithRedirect } = useAuth0();
const { isAuthenticated, isLoading } = useConvexAuth();
</script>

<template>
  <main v-if="!isAuthenticated" class="container">
    You must be logged in to see your todos
    <UiButton :is-loading="isLoading" @click="loginWithRedirect">Login</UiButton>
  </main>

  <main v-else class="container space-y-3">
    <section class="surface">
      <Suspense>
        <TodoList />
        <template #fallback><p>Loading todos...</p></template>
      </Suspense>
    </section>

    <section class="surface">
      <AddTodoForm />
    </section>
  </main>
</template>

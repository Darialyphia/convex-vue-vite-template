<script setup lang="ts">
definePage({
  name: 'Home'
});

const { loginWithRedirect } = useAuth0();
const { isLoading } = useConvexAuth();
</script>

<template>
  <main class="container space-y-3">
    <section class="surface">
      <AddTodoForm />
    </section>

    <section class="surface">
      <EnsureAuthenticated>
        <template #loading>
          <div class="center">
            <UiSpinner size="lg" />
          </div>
        </template>

        <template #fallback>
          You must be logged in to see your todos
          <UiButton :is-loading="isLoading" @click="loginWithRedirect">Login</UiButton>
        </template>

        <TodoListPaginated />
      </EnsureAuthenticated>
    </section>
  </main>
</template>

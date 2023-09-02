<script setup lang="ts">
import AddTodoForm from '@/components/AddTodoForm.vue';
import TodoListPaginated from '@/components/TodoListPaginated.vue';
import EnsureAuthenticated from '@/components/convex/EnsureAuthenticated.vue';

import { useAuth0 } from '@auth0/auth0-vue';

const { loginWithRedirect } = useAuth0();
</script>

<template>
  <main class="container space-y-3">
    <section class="surface">
      <Suspense>
        <EnsureAuthenticated>
          <TodoListPaginated />

          <template #fallback>
            You must be logged in to see your todos
            <button @click="loginWithRedirect()">Login</button>
          </template>

          <template #loading><p>Authenticating...</p></template>
        </EnsureAuthenticated>

        <template #fallback><p>Loading todos...</p></template>
      </Suspense>
    </section>

    <section class="surface">
      <AddTodoForm />
    </section>
  </main>
</template>

<route lang="json">
{
  "name": "Home",
  "meta": {
    "needsAuth": false
  }
}
</route>

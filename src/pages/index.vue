<script setup lang="ts">
import TodoList from '@/components/TodoList.vue';
import AddTodoForm from '@/components/AddTodoForm.vue';
import { useConvexAuth } from '@/composables/convex';
import { useAuth0 } from '@auth0/auth0-vue';

const { isLoading, isAuthenticated } = useConvexAuth();
const { loginWithRedirect } = useAuth0();
</script>

<template>
  <main v-if="!isAuthenticated" class="container">
    You must be logged in to see your todos
    <button :disabled="isLoading" @click="loginWithRedirect()">Login</button>
  </main>
  <main class="container space-y-3">
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

<route lang="json">
{
  "name": "Home",
  "meta": {
    "needsAuth": false
  }
}
</route>

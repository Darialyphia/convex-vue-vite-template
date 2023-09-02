<script setup lang="ts">
import { reactive } from 'vue';
import { api } from '@/api';
import { useAuth0 } from '@auth0/auth0-vue';
import { useMutation } from '@/composables/convex';

import PaginatedQuery from '@/components/convex/PaginatedQuery.vue';
import EnsureAuthenticated from '@/components/convex/EnsureAuthenticated.vue';

const { loginWithRedirect } = useAuth0();
const { isLoading, mutate: addTodo } = useMutation(api.todos.add);
const { isLoading: isRemoving, mutate: removeTodo } = useMutation(api.todos.remove);
const { mutate: setCompleted } = useMutation(api.todos.setCompleted);

const form = reactive({
  text: ''
});

const onSubmit = async () => {
  await addTodo(form);
  form.text = '';
};

const ITEMS_PER_PAGE = 5;
</script>

<template>
  <main class="container space-y-3">
    <section>
      <EnsureAuthenticated>
        <template #loading>Authenticating...</template>

        <template #fallback>
          You must be logged in to see your todos
          <button @click="loginWithRedirect()">Login</button>
        </template>

        <PaginatedQuery
          v-slot="{ data: todos, status, loadMore }"
          :num-items="ITEMS_PER_PAGE"
          :query="api => api.todos.paginatedList"
          :args="{}"
        >
          <p v-if="!todos.length">No todos yet !</p>

          <article v-for="todo in todos" :key="todo._id">
            <input
              type="checkbox"
              :aria-label="todo.completed ? 'Uncheck todo' : 'Check todo'"
              @change="setCompleted({ id: todo._id, completed: !todo.completed })"
            />
            {{ todo.text }}
            <button
              title="remove todo"
              :disabled="isRemoving"
              @click="removeTodo({ id: todo._id })"
            >
              X
            </button>
          </article>

          <button :disabled="status !== 'CanLoadMore'" @click="loadMore(ITEMS_PER_PAGE)">
            Load more
          </button>
        </PaginatedQuery>
      </EnsureAuthenticated>
    </section>

    <form @submit.prevent="onSubmit">
      <label for="text">What needs to be done ?</label>
      <input id="text" v-model="form.text" />
      <button :disabled="isLoading">Add todo</button>
    </form>
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

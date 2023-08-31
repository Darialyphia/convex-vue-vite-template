<script setup lang="ts">
import { api } from '@/api';

const todos = await useSuspenseQuery(api.todos.list);
const addTodo = useMutation(api.todos.add);
const removeTodo = useMutation(api.todos.remove);
const setCompleted = useMutation(api.todos.setCompleted);

const todoText = ref('');

const onSubmit = async () => {
  await addTodo({ text: todoText.value });
  todoText.value = '';
};
</script>

<template>
  <main class="container surface">
    <h1>Convex Vue todo list</h1>

    <p v-if="!todos.length">No todos yet !</p>

    <ul v-auto-animate>
      <li v-for="todo in todos" :key="todo._id">
        <input
          v-model="todo.completed"
          type="checkbox"
          @change="setCompleted({ id: todo._id, completed: todo.completed })"
        />
        {{ todo.text }}
        <button @click="removeTodo({ id: todo._id })">
          <UiIcon icon="mdi:close" />
        </button>
      </li>
    </ul>

    <form class="space-y-2" @submit.prevent="onSubmit">
      <label for="text">What needs to be done ?</label>
      <input v-model="todoText" />

      <button>Add todo</button>
    </form>
  </main>
</template>

<style scoped lang="postcss">
form {
  > :is(label, input) {
    display: block;
  }

  > input {
    border: solid var(--border-size-1) var(--gray-5);
  }

  > button {
    padding-block: var(--size-1);
    padding-inline: var(--size-2);

    font-weight: var(--font-weight-5);
    color: white;

    background-color: var(--blue-7);
    border-radius: var(--radius-2);
  }
}

li {
  display: flex;
  gap: var(--size-2);
  align-items: center;

  &:has(input:checked) {
    text-decoration: line-through;
  }

  > button {
    padding: 0;
    color: var(--red-7);
    background-color: transparent;
    border: none;
  }
}
</style>

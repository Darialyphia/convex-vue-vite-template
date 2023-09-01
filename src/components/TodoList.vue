<script setup lang="ts">
import { api } from '@/api';
import { useSuspenseQuery, useMutation } from '@/composables/convex';

const todos = await useSuspenseQuery(api.todos.list);
const removeTodo = useMutation(api.todos.remove);
const setCompleted = useMutation(api.todos.setCompleted);
</script>

<template>
  <p v-if="!todos.length">No todos yet !</p>

  <ul v-auto-animate>
    <li v-for="todo in todos" :key="todo._id">
      <input
        v-model="todo.completed"
        type="checkbox"
        @change="setCompleted({ id: todo._id, completed: todo.completed })"
      />
      {{ todo.text }}
      <button title="remove todo" @click="removeTodo({ id: todo._id })">X</button>
    </li>
  </ul>
</template>

<style scoped lang="postcss">
li {
  display: flex;
  gap: var(--size-2);
  align-items: center;

  &:has(input:checked) {
    text-decoration: line-through;
  }
}
</style>

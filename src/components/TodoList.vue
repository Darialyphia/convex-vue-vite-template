<script setup lang="ts">
import { api } from '@/api';

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
      <UiIconButton
        icon="mdi:close"
        title="remove todo"
        style="--button-color: var(--error)"
        @click="removeTodo({ id: todo._id })"
      />
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

<script setup lang="ts">
import { api } from '@/api';
import { useSuspenseQuery, useMutation } from '@/composables/convex';

const todos = await useSuspenseQuery(api.todos.list);
const { isLoading: isRemoving, mutate: removeTodo } = useMutation(api.todos.remove);
const setCompleted = useMutation(api.todos.setCompleted);
</script>

<template>
  <p v-if="!todos.length">No todos yet !</p>

  <ul>
    <li v-for="todo in todos" :key="todo._id">
      <input
        v-model="todo.completed"
        type="checkbox"
        @change="setCompleted.mutate({ id: todo._id, completed: todo.completed })"
      />
      {{ todo.text }}
      <button
        title="remove todo"
        :disabled="isRemoving"
        @click="removeTodo({ id: todo._id })"
      >
        X
      </button>
    </li>
  </ul>
</template>

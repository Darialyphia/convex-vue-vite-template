<script setup lang="ts">
import { api } from '@/api';
import { useMutation } from '@/composables/convex/useMutation';
import type { Doc } from 'convex/_generated/dataModel';

const { todo } = defineProps<{
  todo: Doc<'todos'>;
}>();

const { isLoading: isRemoving, mutate: removeTodo } = useMutation(api.todos.remove);
const { mutate: setCompleted } = useMutation(api.todos.setCompleted);
</script>

<template>
  <article>
    <input
      type="checkbox"
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
</template>

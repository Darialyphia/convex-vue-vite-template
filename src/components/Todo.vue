<script setup lang="ts">
import { api } from '@/api';
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
    <UiIconButton
      icon="mdi:close"
      title="remove todo"
      style="--button-color: var(--error)"
      :disabled="isRemoving"
      @click="removeTodo({ id: todo._id })"
    />
  </article>
</template>

<style scoped lang="postcss">
article {
  display: flex;
  gap: var(--size-2);
  align-items: center;

  &:has(input:checked) {
    text-decoration: line-through;
  }
}
</style>

<script setup lang="ts">
import { api } from '@/api';
import type { Doc } from 'convex/_generated/dataModel';

const { todo } = defineProps<{
  todo: Doc<'todos'>;
}>();

const { isLoading: isRemoving, mutate: removeTodo } = useMutation(api.todos.remove);
const { mutate: setCompleted } = useMutation(api.todos.setCompleted);

const completedVModel = computed({
  get() {
    return todo.completed;
  },
  set(value) {
    setCompleted({ id: todo._id, completed: value });
  }
});
</script>

<template>
  <article>
    <UiCheckbox :id="`${todo._id}-checkbox`" v-model="completedVModel">
      {{ todo.text }}
    </UiCheckbox>
    <UiIconButton
      icon="mdi:close"
      title="remove todo"
      :theme="{ colorHsl: 'color-error-hsl' }"
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

<script setup lang="ts">
import { api } from '@/api';
import { toTypedSchema } from '@vee-validate/zod';
import { object, string } from 'zod';

const todos = await useSuspenseQuery(api.todos.list);
const addTodo = useMutation(api.todos.add);
const removeTodo = useMutation(api.todos.remove);
const setCompleted = useMutation(api.todos.setCompleted);

const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(
    object({
      text: string().min(1)
    })
  )
});

const onSubmit = handleSubmit(async values => {
  await addTodo(values);
  resetForm();
});
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
        <UiIconButton
          icon="mdi:close"
          title="remove todo"
          style="--button-color: var(--error)"
          @click="removeTodo({ id: todo._id })"
        />
      </li>
    </ul>

    <form class="space-y-2" @submit.prevent="onSubmit">
      <UiFormControl v-slot="{ error, inputProps }" name="text" class="w-sm">
        <UiFormLabel for="text">What needs to be done ?</UiFormLabel>
        <UiTextInput v-bind="inputProps" id="text" />
        <UiFormError :error="error" />
      </UiFormControl>

      <UiButton>Add todo</UiButton>
    </form>
  </main>
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

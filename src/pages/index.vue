<script setup lang="ts">
import { api } from '@/api';
import { toTypedSchema } from '@vee-validate/zod';
import { object, string } from 'zod';

const addTodo = useMutation(api.todos.add);

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

    <Suspense>
      <TodoList />
      <template #fallback>Loading todos...</template>
    </Suspense>

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

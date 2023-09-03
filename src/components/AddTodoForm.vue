<script setup lang="ts">
import { api } from '@/api';
import { toTypedSchema } from '@vee-validate/zod';
import { object, string } from 'zod';
import { vFocusOn } from '@/directives/vFocusOn';

const { isLoading, mutate: addTodo } = useMutation(api.todos.add);

const { handleSubmit, resetForm } = useForm({
  validationSchema: toTypedSchema(
    object({
      text: string({ required_error: "Can't have an empty todo, can you ?" }).min(1)
    })
  )
});

const onSubmit = handleSubmit(async values => {
  await addTodo(values);
  resetForm();
  focus('todo-form');
});

const { isAuthenticated } = useConvexAuth();

const focus = useFocusOn();
onMounted(() => {
  focus('todo-form');
});
</script>

<template>
  <form @submit.prevent="onSubmit">
    <UiFormControl v-slot="{ error, inputProps }" name="text" class="max-w-sm space-y-2">
      <UiFormLabel for="text">What needs to be done ?</UiFormLabel>
      <UiTextInput v-bind="inputProps" id="text" v-focus-on="'todo-form'" />
      <UiFormError :error="error" :is-always-visible="false" />
    </UiFormControl>

    <UiButton :disabled="!isAuthenticated" :is-loading="isLoading">Add todo</UiButton>
  </form>
</template>

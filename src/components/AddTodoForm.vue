<script setup lang="ts">
import { api } from '@/api';
import { toTypedSchema } from '@vee-validate/zod';
import type { Id } from 'convex/_generated/dataModel';
import { object, string } from 'zod';
import { vFocusOn } from '@/directives/vFocusOn';

const { user } = useAuth0();
const { isLoading, mutate: addTodo } = useMutation(api.todos.add, {
  optimisticUpdate: (localStore, args) => {
    const currentValue = localStore.getQuery(api.todos.list, {});
    if (currentValue === undefined) return;

    localStore.setQuery(
      api.todos.list,
      {},
      currentValue.concat({
        _id: 'optimistic' as Id<'todos'>,
        _creationTime: Date.now(),
        text: args.text,
        completed: false,
        userId: user.value!.sub!
      })
    );
  }
});

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
});

const { isAuthenticated } = useConvexAuth();

const focus = useFocus();
onMounted(() => {
  focus('foo');
});
</script>

<template>
  <form class="space-y-2" @submit.prevent="onSubmit">
    <UiFormControl v-slot="{ error, inputProps }" name="text" class="w-sm">
      <UiFormLabel for="text">What needs to be done ?</UiFormLabel>
      <UiTextInput v-bind="inputProps" id="text" v-focus-on="'foo'" />
      <UiFormError :error="error" :is-always-visible="false" />
    </UiFormControl>

    <UiButton :disabled="!isAuthenticated" :is-loading="isLoading">Add todo</UiButton>
  </form>
</template>

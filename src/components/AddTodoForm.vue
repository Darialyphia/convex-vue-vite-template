<script setup lang="ts">
import { api } from '@/api';
import { useMutation } from '@/composables/convex';
import { reactive } from 'vue';

const addTodo = useMutation(api.todos.add);

const form = reactive({
  text: ''
});

const onSubmit = async () => {
  await addTodo(form);
  form.text = '';
};
</script>

<template>
  <form class="space-y-2" @submit.prevent="onSubmit">
    <label for="text">What needs to be done ?</label>
    <input id="text" v-model="form.text" />
    <button>Add todo</button>
  </form>
</template>

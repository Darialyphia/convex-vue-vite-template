<script setup lang="ts">
import { api } from '@/api';
import { usePaginatedQuery } from '@/composables/convex/usePaginatedQuery';
import Todo from './Todo.vue';

const ITEMS_PER_PAGE = 5;
const {
  results: todos,
  status,
  loadMore
} = usePaginatedQuery(api.todos.paginatedList, {}, { initialNumItems: ITEMS_PER_PAGE });
</script>

<template>
  <p v-if="!todos.length">No todos yet !</p>

  <div class="grid gap-1">
    <Todo v-for="todo in todos" :key="todo._id" :todo="todo" />
  </div>

  <button :disabled="status !== 'CanLoadMore'" @click="loadMore(ITEMS_PER_PAGE)">
    Load more
  </button>
</template>

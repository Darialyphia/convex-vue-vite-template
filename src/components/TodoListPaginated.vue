<script setup lang="ts">
import { api } from '@/api';

const ITEMS_PER_PAGE = 5;
const {
  results: todos,
  status,
  loadMore
} = usePaginatedQuery(api.todos.paginatedList, {}, { initialNumItems: ITEMS_PER_PAGE });
</script>

<template>
  <p v-if="!todos.length">No todos yet !</p>

  <div v-auto-animate class="grid gap-1">
    <Todo v-for="todo in todos" :key="todo._id" :todo="todo" />
  </div>

  <UiButton :disabled="status !== 'CanLoadMore'" @click="loadMore(ITEMS_PER_PAGE)">
    Load more
  </UiButton>
</template>

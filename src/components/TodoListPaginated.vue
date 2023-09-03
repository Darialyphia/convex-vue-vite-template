<script setup lang="ts">
const ITEMS_PER_PAGE = 5;
</script>

<template>
  <PaginatedQuery
    v-slot="{ data: todos, isEmpty, canLoadMore, isLoadingMore, loadMore }"
    :num-items="ITEMS_PER_PAGE"
    :query="api => api.todos.paginatedList"
    :args="{}"
  >
    <p v-if="isEmpty">No todos yet !</p>

    <div v-auto-animate class="grid gap-1">
      <Todo v-for="todo in todos" :key="todo._id" :todo="todo" />
    </div>

    <UiButton
      :disabled="!canLoadMore"
      :is-loading="isLoadingMore"
      @click="loadMore(ITEMS_PER_PAGE)"
    >
      Load more
    </UiButton>
  </PaginatedQuery>
</template>

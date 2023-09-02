<script setup lang="ts">
const seed = ref(0);
</script>

<template>
  <Query :query="api => api.todos.list" :args="{ seed: seed }" @error="seed++">
    <template #loading>
      <p>Loading todos...</p>
    </template>

    <template #default="{ data: todos }">
      <p v-if="!todos.length">No todos yet !</p>

      <div v-auto-animate class="geis gap-1">
        <Todo v-for="todo in todos" :key="todo._id" :todo="todo" />
      </div>
    </template>
  </Query>
</template>

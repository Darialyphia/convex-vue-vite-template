<template>
  <Query :query="api => api.todos.list" :args="{}">
    <template #loading>
      <div class="center gap-3">
        <UiSpinner size="lg" />
        <p>Loading your todos...</p>
      </div>
    </template>

    <template #error="{ clearError }">
      <div class="center c-error gap-3">
        <p>An error has occured while loading your todos</p>
        <p>This is a test, so try again to see the query succeed</p>
        <UiButton @click="clearError">Retry</UiButton>
      </div>
    </template>

    <template #default="{ data: todos }">
      <p v-if="!todos.length">No todos yet !</p>

      <div v-auto-animate class="grid gap-1">
        <Todo v-for="todo in todos" :key="todo._id" :todo="todo" />
      </div>
    </template>
  </Query>
</template>

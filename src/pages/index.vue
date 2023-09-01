<script setup lang="ts">
import TodoList from '@/components/TodoList.vue';
import AddTodoForm from '@/components/AddTodoForm.vue';
</script>

<template>
  <main class="container space-y-3">
    <section class="surface">
      <Suspense>
        <TodoList />
        <template #fallback><p>Loading todos...</p></template>
      </Suspense>
    </section>

    <section class="surface">
      <AddTodoForm />
    </section>
  </main>
</template>

<route lang="json">
{
  "name": "Home",
  "meta": {
    "needsAuth": false
  }
}
</route>

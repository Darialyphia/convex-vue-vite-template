<script setup lang="ts">
definePage({
  name: 'Home'
});
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

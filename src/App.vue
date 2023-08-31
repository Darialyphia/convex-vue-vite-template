<template>
  <RouterView v-slot="{ route, Component }">
    <Suspense>
      <component :is="Component" :key="route.path" />

      <template #fallback>
        <div>Loading...</div>
      </template>
    </Suspense>
  </RouterView>
</template>

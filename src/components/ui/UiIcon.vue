<script setup lang="ts">
import { Icon } from '@iconify/vue';

const {
  icon,
  inline,
  size = 'md'
} = defineProps<{
  icon: string;
  inline?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
}>();
</script>

<template>
  <Icon
    :icon="icon"
    class="ui-icon"
    :class="[size, { 'ui-icon--inline': inline }]"
    :inline="inline"
  />
</template>

<style scoped lang="postcss">
.ui-icon--inline {
  display: inline;
}

.ui-icon {
  flex-shrink: 0;
  &:where(.sm) {
    font-size: var(--font-size-1);
  }
  &:where(.md) {
    font-size: var(--font-size-3);
  }
  &:where(.lg) {
    font-size: var(--font-size-4);
  }
  &:where(.xl) {
    font-size: var(--font-size-6);
  }
  &:where(.xxl) {
    font-size: var(--font-size-7);
  }
}
</style>

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
@layer components {
  .ui-icon--inline {
    display: inline;
  }

  .ui-icon {
    --_icon-size: var(--icon-size, var(--font-size-3));

    flex-shrink: 0;
    font-size: var(--_icon-size);
  }
}
</style>

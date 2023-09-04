<script setup lang="ts">
import type { ThemeProps } from '@/composables/useStyles';
import { Icon } from '@iconify/vue';

const { icon, inline, theme } = defineProps<
  ThemeProps<'size'> & {
    icon: string;
    inline?: boolean;
  }
>();

const styles = useStyles(
  {
    prefix: 'ui-icon',
    config: {
      size: 'font-size-3'
    }
  },
  () => theme
);
</script>

<template>
  <Icon
    :icon="icon"
    class="ui-icon"
    :class="{ 'ui-icon--inline': inline }"
    :inline="inline"
    :style="styles"
  />
</template>

<style scoped lang="postcss">
@layer components {
  .ui-icon--inline {
    display: inline;
  }

  .ui-icon {
    flex-shrink: 0;
    font-size: var(--ui-icon-size);
  }
}
</style>

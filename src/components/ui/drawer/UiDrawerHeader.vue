<script setup lang="ts">
import type { ThemeProps } from '@/composables/useStyles';

const { theme } = defineProps<ThemeProps<'bg' | 'color' | 'size' | 'weight'>>();

const styles = useStyles(
  {
    config: {
      bg: '[inherit]',
      color: '[inherit]',
      size: 'font-size-5',
      weight: 'font-weight-5'
    },
    prefix: 'ui-drawer-header'
  },
  () => theme
);
</script>

<template>
  <ArkDialogTitle as-child>
    <header>
      <h2>
        <slot />
      </h2>
      <ArkDialogCloseTrigger>
        <UiIconButton icon="material-symbols:close" title="close" />
      </ArkDialogCloseTrigger>
    </header>
  </ArkDialogTitle>
</template>

<style scoped lang="postcss">
@layer components {
  header {
    position: sticky;
    top: 0;

    display: flex;
    justify-content: space-between;

    padding: var(--size-4) var(--size-5);

    font-size: v-bind('styles.size');
    font-weight: v-bind('styles.weight');
    color: v-bind('styles.color');

    background-color: v-bind('styles.bg');

    > h2 {
      font-size: inherit;
      font-weight: inherit;
    }
  }

  [data-part='close-trigger'] {
    padding: 0;
  }
}
</style>

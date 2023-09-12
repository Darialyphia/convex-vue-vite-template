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
    prefix: 'ui-modal-header'
  },
  () => theme
);
</script>

<template>
  <ArkDialogTitle as-child>
    <header :style="styles">
      <h2><slot /></h2>
      <ArkDialogCloseTrigger>
        <UiIconButton icon="material-symbols:close" title="close" class="self-center" />
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

    font-size: var(--ui-drawer-header-size);
    font-weight: var(--ui-drawer-header-weight);
    color: var(--ui-drawer-header-color);

    background-color: var(--ui-drawer-header-bg);

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

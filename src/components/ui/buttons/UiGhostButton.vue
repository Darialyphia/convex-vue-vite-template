<script setup lang="ts">
import type { ThemeProps } from '@/composables/useStyles';
import type { ButtonBaseThemeKeys, ButtonProps } from './UiButtonBase.vue';

type ButtonExtraKeys = 'bg' | 'color' | 'hoverColor' | 'hoverBg';
export type ButtonGhostThemeKeys = ButtonBaseThemeKeys | ButtonExtraKeys;

const { theme, ...props } = defineProps<ButtonProps & ThemeProps<ButtonGhostThemeKeys>>();

const defaultStyles = {
  color: '[inherit]',
  bg: 'transparent',
  hoverBg: 'button-ghost-hover-bg',
  hoverColor: '[inherit]'
};

const styles = useStyles<ButtonExtraKeys>(
  {
    config: defaultStyles,
    prefix: 'ui-ghost-button'
  },
  () => theme
);
</script>

<template>
  <UiButtonBase
    v-bind="props"
    :theme="{ ...defaultStyles, ...theme }"
    class="ui-button-ghost"
  >
    <slot />
  </UiButtonBase>
</template>

<style scoped lang="postcss">
@layer components {
  .ui-button-ghost {
    --ui-ghost-button-bg-opacity: 0.25;
    --ui-ghost-button-hover-bg: hsl(
      var(--color-primary-hsl) / var(--ui-ghost-button-bg-opacity)
    );

    html.dark & {
      --button-ghost-bg-opacity: 0.25;
    }

    &:disabled {
      --ui-button-base-color: var(--text-disabled);
      --ui-button-base-bg: transparent;
    }

    @media (hover: hover) and (pointer: fine) {
      &:hover:not(:disabled) {
        --ui-button-base-bg: v-bind('styles.hoverBg');
        --ui-button-base-color: v-bind('styles.hoverColor');
      }
    }
  }
}
</style>

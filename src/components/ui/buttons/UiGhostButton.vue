<script setup lang="ts">
import type { ThemeProps } from '@/composables/useStyles';
import type { ButtonBaseThemeKeys, ButtonProps } from './UiButtonBase.vue';

type ButtonExtraKeys = 'bg' | 'colorHsl';
export type ButtonGhostThemeKeys = ButtonBaseThemeKeys | ButtonExtraKeys;

const { theme, ...props } = defineProps<ButtonProps & ThemeProps<ButtonGhostThemeKeys>>();

const styles = useStyles<ButtonExtraKeys>(
  {
    config: {
      colorHsl: 'color-text-1-hsl',
      bg: 'transparent'
    },
    prefix: 'ui-ghost-button'
  },
  () => theme
);

const passthroughTheme = computed(() => {
  if (!theme) return theme;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { colorHsl, bg, ...rest } = theme;

  return rest;
});
</script>

<template>
  <UiButtonBase
    v-bind="props"
    :theme="passthroughTheme"
    class="ui-button-ghost"
    :style="styles"
  >
    <slot />
  </UiButtonBase>
</template>

<style scoped lang="postcss">
@layer components {
  .ui-button-ghost {
    --ui-ghost-button-bg-opacity: 0.15;
    --ui-button-base-bg: var(--ui-ghost-button-bg);
    --ui-button-base-color: hsl(var(--ui-ghost-button-color-hsl));

    html.dark & {
      --button-ghost-bg-opacity: 0.25;
    }

    &:disabled {
      --ui-button-base-disabled-color: var(--text-disabled);
      --ui-button-base-disabled-bg: transparent;
    }

    @media (hover: hover) and (pointer: fine) {
      &:hover:not(:disabled) {
        --ui-button-base-bg: hsl(
          var(--ui-ghost-button-color-hsl) / var(--ui-ghost-button-bg-opacity)
        );
      }
    }
  }
}
</style>

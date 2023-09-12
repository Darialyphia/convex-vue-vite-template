<script setup lang="ts">
import type { ThemeProps } from '@/composables/useStyles';
import type { ButtonBaseThemeKeys, ButtonProps } from './UiButtonBase.vue';

type ButtonExtraKeys = 'bg' | 'color' | 'hoverColor' | 'hoverBg';

const { theme, ...props } = defineProps<
  ButtonProps & ThemeProps<ButtonBaseThemeKeys | ButtonExtraKeys>
>();

const styles = useStyles<ButtonExtraKeys>(
  {
    config: {
      color: 'text-on-primary',
      bg: 'primary',
      hoverBg: 'primary-hover',
      hoverColor: 'text-on-primary'
    },
    prefix: 'ui-button'
  },
  () => theme
);

const passthroughTheme = computed(() => {
  if (!theme) return theme;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { color, bg, hoverBg, hoverColor, ...rest } = theme;

  return rest;
});
</script>

<template>
  <UiButtonBase
    v-bind="props"
    :theme="passthroughTheme"
    class="ui-button"
    :style="styles"
  >
    <slot />
  </UiButtonBase>
</template>

<style scoped lang="postcss">
@layer components {
  .ui-button {
    --ui-button-base-bg: var(--ui-button-bg);
    --ui-button-base-color: var(--ui-button-color);

    @media (hover: hover) and (pointer: fine) {
      &:hover:not(:disabled) {
        --ui-button-base-bg: var(--ui-button-hover-bg);
        --ui-button-base-color: var(--ui-button-hover-color);
      }
    }
  }
}
</style>

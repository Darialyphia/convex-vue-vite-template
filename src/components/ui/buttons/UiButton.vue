<script setup lang="ts">
import type { ThemeProps } from '@/composables/useStyles';
import type { ButtonBaseThemeKeys, ButtonProps } from './UiButtonBase.vue';

type ButtonExtraKeys = 'bg' | 'color' | 'hoverColor' | 'hoverBg';

const { theme, ...props } = defineProps<
  ButtonProps & ThemeProps<ButtonBaseThemeKeys | ButtonExtraKeys>
>();

const defaultStyles = {
  color: 'text-on-primary',
  bg: 'primary',
  hoverBg: 'primary-hover',
  hoverColor: 'text-on-primary'
};

const styles = useStyles<ButtonExtraKeys>(
  {
    config: defaultStyles,
    prefix: 'ui-button'
  },
  () => theme
);
</script>

<template>
  <UiButtonBase v-bind="props" :theme="{ ...defaultStyles, ...theme }" class="ui-button">
    <slot />
  </UiButtonBase>
</template>

<style scoped lang="postcss">
@layer components {
  .ui-button {
    @media (hover: hover) and (pointer: fine) {
      &:hover:not(:disabled) {
        --ui-button-base-bg: v-bind('styles.hoverBg');
        --ui-button-base-color: v-bind('styles.hoverColor');
      }
    }
  }
}
</style>

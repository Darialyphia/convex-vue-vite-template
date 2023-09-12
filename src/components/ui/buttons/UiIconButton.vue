<script setup lang="ts">
import type { ThemeProps } from '@/composables/useStyles';
import type { ButtonProps } from './UiButtonBase.vue';
import type { ButtonGhostThemeKeys } from './UiGhostButton.vue';

type Props = Omit<ButtonProps, 'leftIcon' | 'right-icon'> &
  ThemeProps<ButtonGhostThemeKeys> & {
    icon: string;
    title: string;
  };

const props = defineProps<Props>();

const buttonProps = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { icon, ...rest } = props;
  return rest;
});
</script>

<template>
  <UiGhostButton class="ui-icon-button" v-bind="buttonProps" :aria-label="props.title">
    <UiIcon :icon="props.icon" :theme="props.theme" />
  </UiGhostButton>
</template>

<style scoped lang="postcss">
@layer components {
  .ui-icon-button {
    padding: var(--size-1);
    border-radius: var(--radius-round);
  }
}
</style>
s

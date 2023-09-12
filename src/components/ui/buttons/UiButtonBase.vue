<script setup lang="ts">
import type { ThemeProps } from '@/composables/useStyles';
import type { RouterLinkProps } from 'vue-router/auto';
import { RouterLink } from 'vue-router/auto';

export type ButtonBaseThemeKeys =
  | 'radius'
  | 'size'
  | 'weight'
  | 'bg'
  | 'color'
  | 'borderColor';
export type ButtonTheme = ThemeProps<ButtonBaseThemeKeys>;

export type ButtonProps = ButtonTheme & {
  isLoading?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  isInline?: boolean;
  isCta?: boolean;
  to?: RouterLinkProps['to'];
};

const {
  isLoading = false,
  leftIcon,
  rightIcon,
  isInline,
  isCta,
  to,
  theme
} = defineProps<ButtonProps>();

const styles = useStyles(
  {
    prefix: 'ui-button-base',
    config: {
      bg: 'transparent',
      color: 'text-1',
      radius: 'radius-2',
      size: 'font-size-1',
      weight: 'font-weight-6',
      borderColor: 'transparent',
      disabledBg: 'disabled',
      disabledColor: 'text-on-disabled'
    }
  },
  () => theme
);
const attrs = useAttrs();

const tag = computed(() => {
  if (to) return RouterLink;
  if (attrs.href) return 'a';

  return 'button';
});
</script>

<template>
  <component
    :is="tag"
    :to="to"
    class="ui-button-base"
    :class="{
      'is-inline': isInline,
      'is-cta': isCta,
      'is-loading': isLoading
    }"
    :style="styles"
    :disabled="attrs.disabled || isLoading"
  >
    <UiIcon v-if="leftIcon && !isLoading" :icon="leftIcon" aria-hidden="true" />

    <UiSpinner v-if="isLoading" />
    <slot v-else />

    <UiIcon v-if="rightIcon && !isLoading" :icon="rightIcon" aria-hidden="true" />
  </component>
</template>

<style scoped lang="postcss">
@layer components {
  .ui-button-base {
    display: flex;
    gap: var(--size-2);
    align-items: center;
    justify-content: center;

    width: fit-content;
    padding: var(--size-2-em) var(--size-3-em);

    font-size: var(--ui-button-base-size);
    font-weight: var(--ui-button-base-weight);
    color: var(--ui-button-base-color);
    white-space: nowrap;
    vertical-align: middle;

    background-color: var(--ui-button-base-bg);
    border: solid var(--border-size-1) var(--ui-button-borderColor);
    border-radius: var(--ui-button-base-radius);

    &:disabled:not(.is-loading) {
      color: var(--ui-button-base-disabled-color);
      background-color: var(--ui-button-base-disabled-bg);
    }

    .is-loading {
      opacity: 0.8;
    }

    &,
    &:hover {
      text-decoration: none;
    }

    &:active {
      transform: scale(0.98);
      transition: transform 0.2s;
    }

    &.is-inline {
      display: inline-flex;
    }

    &.is-cta {
      width: 100%;
    }

    & > .icon {
      display: block;
      flex-shrink: 0;
      aspect-ratio: 1;
      font-size: var(--font-size-4);
    }
  }
}
</style>

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
    prefix: 'button',
    config: {
      bg: 'transparent',
      color: 'text-1',
      radius: 'radius-2',
      size: 'font-size-1',
      weight: 'weight-6',
      borderColor: 'transparent'
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
    --_button-weight: v-bind('styles.weight');
    --_button-bg: v-bind('styles.bg');
    --_button-color: v-bind('styles.color');
    --_button-border-color: v-bind('styles.borderColor');

    display: flex;
    gap: var(--size-2);
    align-items: center;
    justify-content: center;

    padding: var(--size-2-em) var(--size-3-em);

    font-size: v-bind('styles.size');
    font-weight: v-bind('styles.weight');
    color: v-bind('styles.color');
    white-space: nowrap;
    vertical-align: middle;

    background-color: v-bind('styles.bg');
    border: solid var(--border-size-1) v-bind('styles.borderColor');
    border-radius: v-bind('styles.radius');

    &:disabled:not(.is-loading) {
      --button-color: var(--text-on-disabled);
      --button-bg: var(--disabled);
    }

    .is-loading {
      opacity: 0.8;
    }

    &,
    &:hover {
      text-decoration: none;
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

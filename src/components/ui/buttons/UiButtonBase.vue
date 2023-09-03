<script setup lang="ts">
import type { RouterLinkProps } from 'vue-router/auto';
import { RouterLink } from 'vue-router/auto';

export type ButtonProps = {
  isLoading?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  isInline?: boolean;
  isCta?: boolean;
  to?: RouterLinkProps['to'];
};

const props = withDefaults(defineProps<ButtonProps>(), {
  leftIcon: undefined,
  rightIcon: undefined,
  isLoading: false,
  to: undefined
});

const attrs = useAttrs();

const tag = computed(() => {
  if (props.to) return RouterLink;
  if (attrs.href) return 'a';

  return 'button';
});
</script>

<template>
  <component
    :is="tag"
    :to="props.to"
    class="ui-button-base"
    :class="{
      'is-inline': props.isInline,
      'is-cta': props.isCta,
      'is-loading': props.isLoading
    }"
    :disabled="attrs.disabled || props.isLoading"
  >
    <UiIcon
      v-if="props.leftIcon && !props.isLoading"
      :icon="props.leftIcon"
      aria-hidden="true"
    />

    <UiSpinner v-if="props.isLoading" />
    <slot v-else />

    <UiIcon
      v-if="props.rightIcon && !props.isLoading"
      :icon="props.rightIcon"
      aria-hidden="true"
    />
  </component>
</template>

<style scoped lang="postcss">
@layer components {
  .ui-button-base {
    --_button-radius: var(--button-radius, var(--radius-2));
    --_button-size: var(--button-size, var(--font-size-2));
    --_button-weight: var(--button-weight, var(--font-weight-6));
    --_button-bg: var(--button-bg, transparent);
    --_button-color: var(--button-color, var(--text-1));
    --_button-border-color: var(--button-border-color, var(--_button-bg));

    display: flex;
    gap: var(--size-2);
    align-items: center;
    justify-content: center;

    padding: var(--size-2-em) var(--size-3-em);

    font-size: var(--_button-size);
    font-weight: var(--_button-weight);
    color: var(--_button-color);
    white-space: nowrap;
    vertical-align: middle;

    background-color: var(--_button-bg);
    border-color: var(--_button-border-color);
    border-style: solid;
    border-width: var(--border-size-1);
    border-radius: var(--_button-radius);

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

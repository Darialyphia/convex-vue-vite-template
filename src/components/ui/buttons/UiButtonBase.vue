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
      :name="props.leftIcon"
      aria-hidden="true"
    />

    <slot />
    <UiIcon
      v-if="props.rightIcon && !props.isLoading"
      :name="props.rightIcon"
      aria-hidden="true"
    />
  </component>
</template>

<style scoped lang="postcss">
:where(.ui-button-base) {
  --button-radius: var(--radius-2);
  --button-size: var(--font-size-2);
  --button-weight: var(--font-weight-6);
  --button-bg: transparent;
  --button-color: var(--text1);
  --button-border-color: var(--button-bg);

  display: flex;
  gap: var(--size-2);
  align-items: center;
  justify-content: center;

  padding: var(--size-2-em) var(--size-3-em);

  font-size: var(--button-size);
  font-weight: var(--button-weight);
  color: var(--button-color);
  white-space: nowrap;
  vertical-align: middle;

  background-color: var(--button-bg);
  border: solid var(--border-size-1) var(--button-border-color);
  border-radius: var(--button-radius);

  &:where(:disabled) {
    cursor: not-allowed;

    &:not(.is-loading) {
      background-color: var(--disabled);
    }
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
</style>

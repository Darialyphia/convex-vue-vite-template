<script lang="ts" setup>
import type { Nullable } from '@/utils/types';
import { type ThemeProps } from '@/composables/useStyles';

type Props = ThemeProps<'offColor' | 'onColor' | 'size'>;
const { theme } = defineProps<Props>();

const styles = useStyles(
  {
    config: {
      offColor: 'gray-6',
      onColor: 'primary',
      size: 'size-4'
    },
    prefix: 'ui-switch'
  },
  () => theme
);
const modelValue = defineModel<Nullable<boolean>>({ required: true });

const toggle = () => {
  modelValue.value = !modelValue.value;
};
</script>

<template>
  <div :class="['ui-input-switch', modelValue && 'is-on']" :styles="styles">
    <slot name="off" />
    <button @click="toggle" />
    <slot name="on" />
  </div>
</template>

<style scoped lang="postcss">
@layer components {
  .ui-input-switch {
    --_color: var(--ui-switch-off-color);
    --_position: 0;

    display: flex;
    gap: var(--size-1);
    align-items: center;

    padding: var(--size-1);

    font-size: var(--font-size-0);

    border-radius: var(--radius-pill);

    & button {
      position: relative;

      width: calc(var(--ui-switch-size) * 2);
      height: var(--ui-switch-size);
      padding-inline: var(--size-1);

      background: var(--surface-1);
      border: solid 1px var(--border);
      border-radius: var(--radius-pill);

      &::after {
        content: '';

        position: absolute;
        top: -1px;
        left: var(--_position);

        aspect-ratio: 1;
        height: var(--ui-switch-size);

        background-color: var(--_color);
        border-radius: var(--radius-pill);

        transition:
          left 200ms,
          background-color 200ms;
      }
    }

    &.is-on button {
      --_color: var(--ui-switch-on-color);
      --_position: calc(100% - var(--_size));
    }
  }
}
</style>

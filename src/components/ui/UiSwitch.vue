<script lang="ts" setup>
const modelValue = defineModel<boolean>();

const toggle = () => {
  modelValue.value = !modelValue.value;
};
</script>

<template>
  <div :class="['ui-input-switch', modelValue && 'is-on']">
    <slot name="off" />
    <button @click="toggle" />
    <slot name="on" />
  </div>
</template>

<style scoped lang="postcss">
.ui-input-switch {
  --off-color: var(--gray-6);
  --on-color: var(--text-1);
  --size: var(--size-4);
  --_switch-color: var(--off-color);
  --_switch-position: 0;

  display: flex;
  gap: var(--size-1);
  align-items: center;

  padding: var(--size-1);

  font-size: var(--font-size-0);

  border-radius: var(--radius-pill);

  & button {
    position: relative;

    width: calc(var(--size) * 2);
    height: var(--size);
    padding-inline: var(--size-1);

    background: var(--surface-1);
    border: solid 1px var(--border);
    border-radius: var(--radius-pill);

    &::after {
      content: '';

      position: absolute;
      top: -1px;
      left: var(--_switch-position);

      aspect-ratio: 1;
      height: var(--size);

      background-color: var(--_switch-color);
      border-radius: var(--radius-pill);

      transition:
        left 200ms,
        background-color 200ms;
    }
  }

  &.is-on button {
    --_switch-color: var(--on-color);
    --_switch-position: calc(100% - var(--size));
  }
}
</style>

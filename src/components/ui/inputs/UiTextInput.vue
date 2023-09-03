<script setup lang="ts">
import type { Nullable } from '@/utils/types';
import { omit, pick } from 'lodash-es';

defineOptions({
  name: 'UiTextInput',
  inheritAttrs: false
});

type Props = {
  modelValue: Nullable<string | number>;
  name?: string;
  type?: string;
  id: string;
  leftIcon?: string;
  rightIcon?: string;
  isError?: boolean;
  debouncedTimeout?: number;
};

const {
  modelValue,
  type = 'text',
  leftIcon,
  rightIcon,
  name,
  debouncedTimeout = 0
} = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void;
}>();

const slots = useSlots();

const attrs = useAttrs();
const wrapperAttrs = computed<{ class: any; style: any }>(() =>
  pick(attrs, ['class', 'style'])
);
const inputAttrs = computed(() => omit(attrs, ['class', 'style']));

const internalValue = ref(modelValue);

const emitValue = () => {
  emit('update:modelValue', internalValue.value ?? '');
};
const emitValueDebounced = useDebounceFn(emitValue, debouncedTimeout);

watch(internalValue, () => {
  if (debouncedTimeout) emitValueDebounced();
  else emitValue();
});

watchEffect(() => {
  internalValue.value = modelValue;
});
</script>

<template>
  <div
    class="ui-input-text"
    :class="[isError && !attrs.disabled && 'error']"
    v-bind="wrapperAttrs"
  >
    <div v-if="slots.left || leftIcon" class="left">
      <slot name="left">
        <UiIcon v-if="leftIcon" :icon="leftIcon" />
      </slot>
    </div>

    <!-- eslint-disable-next-line vuejs-accessibility/form-control-has-label -->
    <input
      :id="id"
      v-model="internalValue"
      :name="name"
      :type="type"
      v-bind="inputAttrs"
    />

    <div v-if="slots.right || rightIcon" class="right">
      <slot name="right">
        <UiIcon v-if="rightIcon" :icon="rightIcon" />
      </slot>
    </div>
  </div>
</template>

<style scoped lang="postcss">
@layer components {
  .ui-input-text {
    --_input-size: var(--input-size, var(--font-size-1));

    overflow: hidden;
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: var(--size-1);
    align-items: center;

    font-size: var(--_input-size);

    background-color: var(--surface-2);
    border: solid 1px var(--border-dimmed);
    border-radius: var(--radius-1);

    &:has(input:focus-visible) {
      outline-color: var(--link);
      outline-style: solid;
      outline-offset: var(--outline-offset);
      transition: outline-offset 145ms var(--ease-2);
    }

    &.error {
      border-color: var(--error);
    }

    & .left,
    & .right {
      display: grid;
      place-content: center;
      height: auto;
    }
    & .left {
      margin-inline-start: var(--size-2);
    }

    & .right {
      margin-inline-end: var(--size-2);
    }

    & .icon {
      font-size: var(--font-size-3);
      color: hsl(var(--primary-hsl) / 0.5);
    }

    & input {
      cursor: text;

      min-width: 0;
      padding-block: var(--size-2);
      padding-inline: var(--size-3);

      color: inherit;

      background-color: inherit;

      &::placeholder {
        color: var(--text-3);
      }

      &:disabled {
        cursor: not-allowed;
      }

      &:focus-visible {
        outline: none;
      }
    }

    &:has(input:disabled) {
      color: var(--text-disabled);
      background: var(--disabled);
    }

    &:has(.left) input {
      padding-inline-start: 0;
    }

    &:has(.right) input {
      padding-inline-end: 0;
    }

    &:not(:has(.left)):not(:has(.right)) {
      grid-template-columns: 1fr;
    }
    &:has(.left):not(:has(.right)) {
      grid-template-columns: auto 1fr;
    }
    &:has(.right):not(:has(.left)) {
      grid-template-columns: 1fr auto;
    }
  }
}
</style>

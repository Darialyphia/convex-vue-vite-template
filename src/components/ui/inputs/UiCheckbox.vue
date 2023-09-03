<script setup lang="ts">
import type { Nullable } from '@/utils/types';

const modelValue = defineModel<Nullable<boolean>>({ required: true });

defineSlots<{
  default(props: { value: Nullable<boolean> }): any;
}>();

const { id } = defineProps<{
  id: string;
}>();

const vModel = computed({
  get() {
    return modelValue.value ?? 'indeterminate';
  },
  set(val) {
    modelValue.value = isString(val) ? undefined : val;
  }
});
</script>
<template>
  <ArkCheckbox :id="id" v-model="vModel">
    <ArkCheckboxControl as-child>
      <div
        class="control"
        :class="modelValue ? 'i-carbon:checkbox-checked-filled' : 'i-carbon:checkbox'"
      />
    </ArkCheckboxControl>

    <ArkCheckboxLabel>
      <slot :value="modelValue" />
    </ArkCheckboxLabel>
  </ArkCheckbox>
</template>

<style scoped lang="postcss">
@layer components {
  [data-scope='checkbox'] {
    &[data-part='root'] {
      --_checkbox-size: var(--checkbox-size, var(--font-size-3));
      --_checkbox-color: var(--checkbox-color, inherit);
      --_checkbox-label-color: var(--checkbox-label-color, inherit);

      display: flex;
      gap: var(--size-1);
      align-items: center;

      &:has(input:focus-visible) [data-part='control'] {
        outline-color: var(--link);
        outline-style: solid;
        outline-offset: 2px;
        transition: outline-offset 145ms var(--ease-2);
      }
    }

    &[data-part='control'] {
      font-size: var(--_checkbox-size);
      color: var(
        --_checkbox-color
      ) !important; /* need overrides uno icon class in the utilities layer */
    }

    &[data-part='label'] {
      color: var(--_checkbox-label-color);
    }
  }
}
</style>

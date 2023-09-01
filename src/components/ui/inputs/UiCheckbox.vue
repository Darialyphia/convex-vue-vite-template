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
  <ArkCheckbox :id="id" v-slot="{ inputProps }" v-model="vModel" class="ui-checkbox">
    <input v-bind="inputProps" />
    <ArkCheckboxControl>
      <div
        class="h-5 w-5"
        :class="
          modelValue
            ? 'i-material-symbols:check-box-outline'
            : 'i-material-symbols:check-box-outline-blank'
        "
      />
    </ArkCheckboxControl>
    <ArkCheckboxLabel>
      <slot :value="modelValue" />
    </ArkCheckboxLabel>
  </ArkCheckbox>
</template>

<style scoped lang="postcss">
.ui-checkbox {
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
</style>

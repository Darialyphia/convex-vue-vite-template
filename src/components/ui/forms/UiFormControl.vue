<script setup lang="ts">
const {
  name,
  keepValueOnUnmount = false,
  validateOnChange = false
} = defineProps<{
  name: string;
  keepValueOnUnmount?: boolean;
  validateOnChange?: boolean;
}>();

const { value, errorMessage, meta, handleChange, handleBlur } = useField(
  name,
  undefined,
  {
    keepValueOnUnmount
  }
);

const slotProps = computed(() => ({
  inputProps: {
    name,
    modelValue: value.value as any,
    'onUpdate:modelValue'(val: any) {
      value.value = val;
    },
    onChange: validateOnChange
      ? (e: unknown) => handleChange(e, true)
      : undefined,
    onBlur: handleBlur
  },
  error: meta.touched ? errorMessage.value : undefined
}));
</script>

<template>
  <fieldset>
    <slot v-bind="slotProps" />
  </fieldset>
</template>

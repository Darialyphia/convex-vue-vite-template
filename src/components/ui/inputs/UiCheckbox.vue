<script setup lang="ts">
import type { ThemeProps } from '@/composables/useStyles';
import type { Nullable } from '@/utils/types';

const modelValue = defineModel<Nullable<boolean>>({ required: true });

defineSlots<{
  default(props: { value: Nullable<boolean> }): any;
}>();

const { id, theme } = defineProps<
  ThemeProps<'size' | 'color' | 'labelColor'> & {
    id: string;
  }
>();

const styles = useStyles(
  {
    config: {
      color: '[inherit]',
      size: 'font-size-3',
      labelColor: '[inherit]'
    },
    prefix: 'ui-checkbox'
  },
  () => theme
);

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
  <ArkCheckbox :id="id" v-model="vModel" :style="styles">
    <ArkCheckboxControl as-child>
      <div>
        <div
          :class="modelValue ? 'i-carbon:checkbox-checked-filled' : 'i-carbon:checkbox'"
        />
      </div>
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
      font-size: var(--ui-checkbox-size);
      color: var(
        --ui-checkbox-color
      ) !important; /* need overrides uno icon class in the utilities layer */
    }

    &[data-part='label'] {
      color: var(--ui-checkbox-label-color);
    }
  }
}
</style>

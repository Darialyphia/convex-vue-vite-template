<script setup lang="ts">
import type { Nullable } from '@/utils/types';

defineOptions({
  name: 'UiFormError'
});

const { error } = defineProps<{ error?: Nullable<boolean | string> }>();
</script>

<template>
  <div class="ui-form-error">
    <transition appear>
      <div v-if="error" class="inner">
        <UiIcon icon="mdi-alert" />
        <span>{{ error }}</span>
      </div>
    </transition>
  </div>
</template>

<style scoped lang="postcss">
.ui-form-error {
  gap: var(--size-2);
  min-height: var(--size-5);
  color: var(--error);

  & svg {
    float: left;
    margin-inline-end: var(--size-2);
    padding-top: var(--size-1);
  }
}
.v-enter-active,
.v-leave-active {
  transition: all 0.3s;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>

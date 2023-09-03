<script setup lang="ts">
defineOptions({
  name: 'UiSpinner'
});

const { size = 'md', delay = 0 } = defineProps<{
  size?: 'sm' | 'md' | 'lg' | 'xl';
  delay?: number;
}>();
</script>

<template>
  <UiIcon icon="svg-spinners:90-ring-with-bg" class="ui-spinner" :class="size" />
</template>

<style scoped lang="postcss">
@keyframes ui-spinner {
  from {
    transform: rotateZ(0);
  }
  to {
    transform: rotateZ(1turn);
  }
}

@keyframes ui-spinner-delay {
  from {
    visibility: hidden;
  }
  99% {
    visibility: hidden;
  }
  to {
    visibility: visible;
  }
}

@layer components {
  .ui-spinner {
    animation:
      ui-spinner 2s ease infinite,
      ui-spinner-delay calc(1ms * v-bind(delay));

    &.sm {
      font-size: var(--font-size-1);
    }

    &.md {
      font-size: var(--font-size-5);
    }

    &.lg {
      font-size: var(--font-size-8);
    }

    &.xl {
      font-size: var(--font-size-11);
    }
  }
}
</style>

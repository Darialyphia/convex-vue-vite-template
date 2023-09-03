<script setup lang="ts">
const { id, direction = 'left' } = defineProps<{
  id: string;
  direction?: 'left' | 'right';
}>();

const isOpened = defineModel('isOpened', { required: true });
</script>

<template>
  <ArkDialog
    :id="id"
    v-slot="{ isOpen, open, close, triggerProps }"
    v-model:open="isOpened"
    modal
  >
    <slot name="trigger" v-bind="triggerProps" />

    <Teleport to="body">
      <Transition :duration="500">
        <div v-if="isOpen" class="wrapper">
          <ArkDialogBackdrop />
          <ArkDialogContainer :class="direction">
            <ArkDialogContent class="surface p-0">
              <slot :is-open="isOpen" :open="open" :close="close" />
            </ArkDialogContent>
          </ArkDialogContainer>
        </div>
      </Transition>
    </Teleport>
  </ArkDialog>
</template>

<style scoped lang="postcss">
[data-scope='dialog'] {
  &[data-part='backdrop'] {
    position: fixed;
    z-index: 2;
    inset: 0;
    background-color: hsl(var(--gray-11-hsl) / 50%);
  }

  &[data-part='container'] {
    position: fixed;
    z-index: 2;
    inset: 0;

    &.right [data-part='content'] {
      margin-inline-start: auto;
    }
  }

  &[data-part='content'] {
    width: 90%;
    max-width: var(--size-sm);
    height: 100%;
  }
}

.wrapper {
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.v-leave-active > [data-part='backdrop'],
.v-enter-active > [data-part='container'] {
  transition-delay: 0.2s;
}

.v-leave-active,
.v-enter-active {
  & > [data-part='backdrop'] {
    transition-timing-function: ease;
    transition-duration: 0.3s;
    transition-property: opacity;
  }
  & > [data-part='container'] {
    transition-timing-function: ease;
    transition-duration: 0.3s;
    transition-property: all;
  }
}

.v-enter-from,
.v-leave-to {
  & > [data-part='backdrop'] {
    opacity: 0;
  }
  & > [data-part='container'].left {
    transform: translateX(-100%);
  }
  & > [data-part='container'].right {
    transform: translateX(100%);
  }
}
</style>

<script setup lang="ts">
const { id, isClosable = true } = defineProps<{
  id: string;
  isClosable?: boolean;
}>();

const isOpened = defineModel('isOpened', { required: true });
</script>

<template>
  <ArkDialog
    :id="id"
    v-slot="{ isOpen, open, close, triggerProps }"
    v-model:open="isOpened"
    modal
    :close-on-esc="isClosable"
    :close-on-outside-click="isClosable"
    :trap-focus="isClosable"
  >
    <slot name="trigger" v-bind="triggerProps" />

    <Teleport to="body">
      <Transition :duration="500">
        <div v-if="isOpen" class="wrapper">
          <ArkDialogBackdrop />
          <ArkDialogContainer>
            <ArkDialogContent
              class="surface p-0"
              :class="!isClosable && 'ui-modal-not-closable'"
            >
              <slot :is-open="isOpen" :open="open" :close="close" />
            </ArkDialogContent>
          </ArkDialogContainer>
        </div>
      </Transition>
    </Teleport>
  </ArkDialog>
</template>

<style scoped lang="postcss">
@layer components {
  [data-scope='dialog'] {
    &:is([data-part='backdrop'], [data-part='container']) {
      position: fixed;
      z-index: 2;
      inset: 0;
    }

    &[data-part='backdrop'] {
      background-color: hsl(var(--gray-11-hsl) / 50%);
    }

    &[data-part='container'] {
      overflow-y: auto;

      width: var(--size-md);
      max-width: 100%;
      max-height: 80%;
      margin: auto;
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
    & > [data-part='container'] {
      transform: translateY(calc(-1 * var(--size-8)));
      opacity: 0;
    }
  }

  :global(.ui-modal-not-closable [data-part='close-trigger']) {
    display: none;
  }
}
</style>

<script setup lang="ts">
import { useRegisterSW } from 'virtual:pwa-register/vue';

const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW();
const close = async () => {
  offlineReady.value = false;
  needRefresh.value = false;
};
</script>

<template>
  <Transition appear>
    <div
      v-if="offlineReady || needRefresh"
      role="alert"
      class="surface service-worker-prompt"
    >
      <span v-if="offlineReady">Application ready to work offline</span>
      <span v-else>
        New update available. Please refresh your browser to apply the update.
      </span>

      <footer>
        <UiGhostButton
          v-if="needRefresh"
          left-icon="ic:baseline-refresh"
          @click="updateServiceWorker()"
        >
          Reload
        </UiGhostButton>
        <UiGhostButton left-icon="material-symbols:arrow-right-alt" @click="close">
          Close
        </UiGhostButton>
      </footer>
    </div>
  </Transition>
</template>

<style scoped lang="postcss">
.service-worker-prompt {
  position: fixed;
  z-index: 1;
  right: 0;
  bottom: 0;

  margin: var(--size-8);

  border: solid 1px var(--border-dimmed);
  box-shadow: var(--shadow-2);

  & > footer {
    display: flex;
    gap: var(--size-3);
    justify-content: flex-end;
    margin-block-start: var(--size-4);
  }

  &.v-enter-active {
    animation: bounce-in 0.5s;
  }
  &.v-leave-active {
    animation: bounce-in 0.5s reverse;
  }
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style>

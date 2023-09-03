<template>
  <ArkDialogTitle as-child>
    <header class="bg-inherit">
      <h2><slot /></h2>
      <ArkDialogCloseTrigger>
        <UiIconButton icon="material-symbols:close" title="close" class="self-center" />
      </ArkDialogCloseTrigger>
    </header>
  </ArkDialogTitle>
</template>

<style scoped lang="postcss">
header {
  position: sticky;
  top: 0;

  display: flex;
  justify-content: space-between;

  padding: var(--size-4) var(--size-5);

  > h2 {
    font-size: var(--font-size-5);
    font-weight: var(--font-weight-5);
  }
}

[data-part='close-trigger'] {
  padding: 0;
}
</style>

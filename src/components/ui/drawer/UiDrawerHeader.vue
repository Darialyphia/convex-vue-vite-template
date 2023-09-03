<template>
  <ArkDialogTitle as-child>
    <header>
      <h2>
        <slot />
      </h2>
      <ArkDialogCloseTrigger>
        <UiIconButton icon="material-symbols:close" title="close" />
      </ArkDialogCloseTrigger>
    </header>
  </ArkDialogTitle>
</template>

<style scoped lang="postcss">
@layer components {
  header {
    --_header-bg: var(--header-bg, inherit);
    --_header-color: var(--header-color, inherit);
    --_header-size: var(--header-size, var(--font-size-5));
    --_header-weight: var(--header-weight, var(--font-weight-5));

    position: sticky;
    top: 0;

    display: flex;
    justify-content: space-between;

    padding: var(--size-4) var(--size-5);

    font-size: var(--_header-size);
    font-weight: var(--_header-weight);
    color: var(--_header-color);

    background-color: var(--_header-bg);

    > h2 {
      font-size: inherit;
      font-weight: inherit;
    }
  }

  [data-part='close-trigger'] {
    padding: 0;
  }
}
</style>

export const getFocusableChildren = (node?: HTMLElement | null | undefined) =>
  node
    ? ([
        ...node.querySelectorAll(
          ':where(button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])):not(:disabled)'
        )
      ] as HTMLElement[])
    : [];

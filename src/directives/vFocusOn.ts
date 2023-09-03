import { focusEmitter } from '@/composables/useFocusOn';
import type { Directive } from 'vue';

export const vFocusOn: Directive = {
  mounted(el, binding) {
    focusEmitter.on('focus', target => {
      if (target === binding.value) {
        el.focus();
        nextTick(() => {
          // can happen when used on a component that doesn't have its "focusable" as the root element
          if (document.activeElement != el) {
            getFocusableChildren(el).at(0)?.focus();
          }
        });
      }
    });
  }
};

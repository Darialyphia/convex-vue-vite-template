module.exports = {
  extends: [
    'stylelint-config-recommended-vue',
    'stylelint-config-html',
    'stylelint-config-clean-order'
  ],
  rules: {
    'no-descending-specificity': null,
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['deep', 'global']
      }
    ],
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['v-deep', 'v-global', 'v-slotted']
      }
    ],
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'apply',
          'config',
          'layer',
          'responsive',
          'screen',
          'tailwind',
          'unocss',
          'variants'
        ]
      }
    ],
    'function-no-unknown': [
      true,
      {
        ignoreFunctions: ['theme', 'v-bind']
      }
    ]
  }
};

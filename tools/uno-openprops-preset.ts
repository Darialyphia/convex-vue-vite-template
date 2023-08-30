// uno.config.ts
import { definePreset } from 'unocss';
import openProps from 'open-props';

const makeSwatch = (hue: string) => {
  const swatch: Record<string, string> = {};
  for (let i = 0; i < 13; i++) {
    const key = `${hue}${i}` as keyof typeof openProps;
    swatch[i] = openProps[key] as string;
  }

  return swatch;
};

const hues = [
  'gray',
  'stone',
  'red',
  'pink',
  'purple',
  'violet',
  'indigo',
  'blue',
  'cyan',
  'teal',
  'green',
  'lime',
  'yellow',
  'orange',
  'choco',
  'brown',
  'sand',
  'camo',
  'jungle'
];

const sizes = [
  '000',
  '00',
  '05',
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15
];

const fontSizes = Object.fromEntries(
  ['000', '00', '0', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((s) => [
    s,
    `var(--font-size-${s})`
  ])
);
const colors = Object.fromEntries(hues.map((hue) => [hue, makeSwatch(hue)]));
const spacing = Object.fromEntries(
  sizes
    .map((size) => [
      [size, `var(--size-${size})`],
      [`${size}-em`, `var(--size-${size}-em)`]
    ])
    .flat()
);

export default () =>
  definePreset({
    name: 'open-props',
    theme: {
      colors,
      boxShadow: {
        1: openProps.shadow1,
        2: openProps.shadow2,
        3: openProps.shadow3,
        4: openProps.shadow4,
        5: openProps.shadow5,
        6: openProps.shadow6,
        'inner-0': openProps.innerShadow0,
        'inner-1': openProps.innerShadow1,
        'inner-2': openProps.innerShadow2,
        'inner-3': openProps.innerShadow3,
        'inner-4': openProps.innerShadow4
      },
      spacing: {
        ...spacing,
        'content-1': 'var(--size-content-1)',
        'content-2': 'var(--size-content-2)',
        'content-3': 'var(--size-content-3)',
        'content-4': 'var(--size-content-4)',
        '1-fluid': 'var(--size-1-fluid)',
        '2-fluid': 'var(--size-2-fluid)',
        '3-fluid': 'var(--size-3-fluid)',
        '4-fluid': 'var(--size-4-fluid)',
        '5-fluid': 'var(--size-5-fluid)',
        '6-fluid': 'var(--size-6-fluid)',
        '7-fluid': 'var(--size-7-fluid)',
        '8-fluid': 'var(--size-8-fluid)',
        '9-fluid': 'var(--size-9-fluid)',
        '10-fluid': 'var(--size-10-fluid)',

        xxs: 'var(--size-xxs)',
        xs: 'var(--size-xxs)',
        sm: 'var(--size-xxs)',
        md: 'var(--size-xxs)',
        lg: 'var(--size-xxs)',
        xl: 'var(--size-xxs)',
        xxl: 'var(--size-xxs)'
      },
      fontSize: {
        ...fontSizes,
        '0-fluid': 'var(--font-size-fluid-0)',
        '1-fluid': 'var(--font-size-fluid-1)',
        '2-fluid': 'var(--font-size-fluid-2)',
        '3-fluid': 'var(--font-size-fluid-3)'
      },
      breakpoints: {
        xxs: '15em',
        xs: '23em',
        sm: '30em',
        md: '48em',
        lg: '64em',
        xl: '90em',
        xxl: '120em'
      }
    },
    rules: [
      [
        /^gradient-(\d+)$/,
        ([, d]) => ({ 'background-image': `var(--gradient-${d})` })
      ],
      [
        /^aspect-(\d+)$/,
        ([, d]) => {
          const val = openProps[`aspect${d}` as keyof typeof openProps] as
            | string
            | undefined;
          return {
            'aspect-ratio': val ?? d
          };
        }
      ]
    ]
  });

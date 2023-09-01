// uno.config.ts
import {
  definePreset,
  type CSSObject,
  type DynamicMatcher,
  type RuleContext,
  type CSSColorValue,
  escapeRegExp
} from 'unocss';
import { parseColor } from '@unocss/preset-mini';
import openProps from 'open-props';

// prettier-ignore
const cssColorFunctions = ['hsl', 'hsla', 'hwb', 'lab', 'lch', 'oklab', 'oklch', 'rgb', 'rgba']
const alphaPlaceholders = ['%alpha', '<alpha-value>'];
const alphaPlaceholdersRE = new RegExp(
  alphaPlaceholders.map(v => escapeRegExp(v)).join('|')
);
const numberWithUnitRE =
  /^(-?\d*(?:\.\d+)?)(px|pt|pc|%|r?(?:em|ex|lh|cap|ch|ic)|(?:[sld]?v|cq)(?:[whib]|min|max)|in|cm|mm|rpx)?$/i;
const globalKeywords = ['inherit', 'initial', 'revert', 'revert-layer', 'unset'];
const directionMap: Record<string, string[]> = {
  l: ['-left'],
  r: ['-right'],
  t: ['-top'],
  b: ['-bottom'],
  s: ['-inline-start'],
  e: ['-inline-end'],
  x: ['-left', '-right'],
  y: ['-top', '-bottom'],
  '': [''],
  bs: ['-block-start'],
  be: ['-block-end'],
  is: ['-inline-start'],
  ie: ['-inline-end'],
  block: ['-block-start', '-block-end'],
  inline: ['-inline-start', '-inline-end']
};

export function hasParseableColor(color: string | undefined, theme: object) {
  return color != null && !!parseColor(color, theme)?.color;
}

export function colorOpacityToString(color: CSSColorValue) {
  const alpha = color.alpha ?? 1;
  return typeof alpha === 'string' && alphaPlaceholders.includes(alpha) ? 1 : alpha;
}

export function colorToString(
  color: CSSColorValue | string,
  alphaOverride?: string | number
) {
  if (typeof color === 'string')
    return color.replace(alphaPlaceholdersRE, `${alphaOverride ?? 1}`);

  const { components } = color;
  let { alpha, type } = color;
  alpha = alphaOverride ?? alpha;
  type = type.toLowerCase();

  alpha = alpha == null ? '' : ` / ${alpha}`;
  if (cssColorFunctions.includes(type)) return `${type}(${components.join(' ')}${alpha})`;
  return `color(${type} ${components.join(' ')}${alpha})`;
}

export function colorResolver(
  property: string,
  varName: string,
  shouldPass?: (css: CSSObject) => boolean
): DynamicMatcher {
  return ([, body]: string[], { theme }: RuleContext): CSSObject | undefined => {
    const data = parseColor(body, theme);
    if (!data) return;

    const { alpha, color, cssColor } = data;

    const css: CSSObject = {};
    if (cssColor) {
      if (alpha != null) {
        css[property] = colorToString(cssColor, alpha);
      } else {
        css[`--un-${varName}-opacity`] = colorOpacityToString(cssColor);
        css[property] = colorToString(cssColor, `var(--un-${varName}-opacity)`);
      }
    } else if (color) {
      css[property] = colorToString(color, alpha);
    }

    if (shouldPass?.(css) !== false) return css;
  };
}

function borderColorResolver(direction: string) {
  return ([, body]: string[], theme: object): CSSObject | undefined => {
    const data = parseColor(body, theme);

    if (!data) return;

    const { alpha, color, cssColor } = data;

    if (cssColor) {
      if (alpha != null) {
        return {
          [`border${direction}-color`]: colorToString(cssColor, alpha)
        };
      }
      if (direction === '') {
        return {
          '--un-border-opacity': colorOpacityToString(cssColor),
          'border-color': colorToString(cssColor, 'var(--un-border-opacity)')
        };
      } else {
        return {
          // Separate this return since if `direction` is an empty string, the first key will be overwritten by the second.
          '--un-border-opacity': colorOpacityToString(cssColor),
          [`--un-border${direction}-opacity`]: 'var(--un-border-opacity)',
          [`border${direction}-color`]: colorToString(
            cssColor,
            `var(--un-border${direction}-opacity)`
          )
        };
      }
    } else if (color) {
      return {
        [`border${direction}-color`]: colorToString(color, alpha)
      };
    }
  };
}

function handlerBorderColor(
  [, a = '', c]: string[],
  { theme }: RuleContext
): CSSObject | undefined {
  if (a in directionMap && hasParseableColor(c, theme)) {
    return Object.assign(
      {},
      ...directionMap[a].map(i => borderColorResolver(i)(['', c], theme))
    );
  }
}

const makeSwatch = (hue: string) => {
  const swatch: Record<string, string> = {};
  for (let i = 0; i < 13; i++) {
    // const key = `${hue}${i}` as keyof typeof openProps;
    swatch[i] = `hsl(var(--${hue}-${i}-hsl) / <alpha-value>)`;
  }

  return swatch;
};
//prettier-ignore
const hues = ['gray','stone','red','pink','purple','violet','indigo','blue','cyan','teal','green','lime','yellow','orange','choco','brown','sand','jungle'];
const sizes = ['000', '00', '05', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const fontSizes = Object.fromEntries(
  ['000', '00', '0', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(s => [
    s,
    `var(--font-size-${s})`
  ])
);
const colors = Object.fromEntries(hues.map(hue => [hue, makeSwatch(hue)]));
const spacing = Object.fromEntries(
  sizes
    .map(size => [
      [size, `var(--size-${size})`],
      [`${size}-em`, `var(--size-${size}-em)`]
    ])
    .flat()
);

export const presetOpenProps = () =>
  definePreset({
    name: 'open-props',

    theme: {
      colors,
      boxShadow: {
        1: 'var(--shadow-1)',
        2: 'var(--shadow-2)',
        3: 'var(--shadow-3)',
        4: 'var(--shadow-4)',
        5: 'var(--shadow-5)',
        6: 'var(--shadow-6)',
        'inner-0': 'var(--inner-shadow-1)',
        'inner-1': 'var(--inner-shadow-1)',
        'inner-2': 'var(--inner-shadow-1)',
        'inner-3': 'var(--inner-shadow-1)',
        'inner-4': 'var(--inner-shadow-1)'
      },
      borderRadius: {
        1: 'var(--radius-1)',
        2: 'var(--radius-2)',
        3: 'var(--radius-3)',
        4: 'var(--radius-4)',
        5: 'var(--radius-5)',
        6: 'var(--radius-6)',
        'blob-1': 'var(--radius-blob-1)',
        'blob-2': 'var(--radius-blob-2)',
        'blob-3': 'var(--radius-blob-3)',
        'blob-4': 'var(--radius-blob-4)',
        'blob-5': 'var(--radius-blob-5)',
        'conditional-1': 'var(--radius-conditional-1)',
        'conditional-2': 'var(--radius-conditional-2)',
        'conditional-3': 'var(--radius-conditional-3)',
        'conditional-4': 'var(--radius-conditional-4)',
        'conditional-5': 'var(--radius-conditional-5)',
        'conditional-6': 'var(--radius-conditional-6)',
        round: 'var(--radius-round)',
        pill: 'var(--radius-pill)'
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
      // open-props gradients
      [/^gradient-(\d+)$/, ([, d]) => ({ 'background-image': `var(--gradient-${d})` })],
      // open-props aspect ratio
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
      ],
      // open-props colors
      [
        /^(?:color|c)-(.+)$/,
        colorResolver('color', 'text'),
        { autocomplete: '(color|c)-$colors' }
      ],
      // auto detection and fallback to font-size if the content looks like a size
      [
        /^text-(.+)$/,
        colorResolver(
          'color',
          'text',
          css => !css.color?.toString().match(numberWithUnitRE)
        ),
        { autocomplete: 'text-$colors' }
      ],
      [
        /^(?:text|color|c)-(.+)$/,
        ([, v]) => (globalKeywords.includes(v) ? { color: v } : undefined),
        { autocomplete: `(text|color|c)-(${globalKeywords.join('|')})` }
      ],

      [
        /^bg-(.+)$/,
        colorResolver('background-color', 'bg'),
        { autocomplete: 'bg-$colors' }
      ],
      // border-color
      [
        /^(?:border|b)-()(?:color-)?(.+)$/,
        handlerBorderColor,
        { autocomplete: ['(border|b)-$colors', '(border|b)-<directions>-$colors'] }
      ],
      [/^(?:border|b)-([xy])-(?:color-)?(.+)$/, handlerBorderColor],
      [/^(?:border|b)-([rltbse])-(?:color-)?(.+)$/, handlerBorderColor],
      [/^(?:border|b)-(block|inline)-(?:color-)?(.+)$/, handlerBorderColor],
      [/^(?:border|b)-([bi][se])-(?:color-)?(.+)$/, handlerBorderColor]
    ]
  });

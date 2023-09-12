import type { MaybeRefOrGetter, StyleValue } from 'vue';
import type { AnyObject } from '@/utils/types';
import { kebabCase } from 'lodash-es';

export type ThemeProps<TKeys extends string> = {
  theme?: { [key in TKeys]?: string };
};

type WithThemeProps<TObj extends AnyObject, TKeys extends string> = TObj &
  ThemeProps<TKeys>;

const rawValueRE = /^\[([^\]]+)]$/; // matches content in brackets, ie: [#123456]

const transformValue = (val: string) => {
  return rawValueRE.test(val)
    ? val.replace(/^\[/, '').replace(/]$/, '')
    : `var(--${val})`;
};

const appliedDefaults = new Set<string>();

export const useStyles = <T extends string>(
  {
    config,
    prefix = ''
  }: {
    config: Required<Record<T, string>>;
    prefix?: string;
  },
  getTheme: MaybeRefOrGetter<WithThemeProps<AnyObject, T>['theme']>
) => {
  if (!appliedDefaults.has(prefix)) {
    appliedDefaults.add(prefix);

    Object.entries(config).map(([key, defaultValue]) => {
      const fallback = transformValue(defaultValue as string);
      const name = `--${prefix}${prefix ? '-' : ''}${kebabCase(key)}`;
      document.documentElement.style.setProperty(name, fallback);
    });
  }

  return computed<StyleValue>(() => {
    const theme = toValue(getTheme);

    return Object.fromEntries(
      Object.keys(config)
        .map(key => {
          const name = `--${prefix}${prefix ? '-' : ''}${kebabCase(key)}`;
          const value = theme?.[key as T];

          return [name, isString(value) ? transformValue(value) : undefined];
        })
        .filter(([, v]) => isDefined(v))
    ) as Record<T, string>;
  });
};

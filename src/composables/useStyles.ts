import type { MaybeRefOrGetter } from 'vue';
import type { AnyObject } from '@/utils/types';
import { kebabCase } from 'lodash-es';

export type ThemeProps<TKeys extends string> = {
  theme?: { [key in TKeys]?: string };
};

type WithThemeProps<TObj extends AnyObject, TKeys extends string> = TObj &
  ThemeProps<TKeys>;

const rawValueRE = new RegExp('^[(.+)]$');

const transformValue = (val: string) => (rawValueRE.test(val) ? val : `var(--${val})`);
export const useStyles = <T extends string>(
  {
    config,
    prefix = ''
  }: {
    config: Required<Record<T, string>>;
    prefix?: string;
  },
  getProps: MaybeRefOrGetter<WithThemeProps<AnyObject, T>['theme']>
) =>
  computed(() => {
    const theme = toValue(getProps);

    return Object.fromEntries(
      Object.entries(config).map(([key, defaultValue]) => {
        const fallback = transformValue(theme?.[key as T] ?? (defaultValue as string));
        return [
          key,
          `var(--${prefix}${prefix ? '-' : ''}${kebabCase(key)}, ${fallback})`
        ];
      })
    ) as Record<T, string>;
  });

import type { Defined, Nullable } from './types';

export const isObject = (x: unknown): x is object =>
  typeof x === 'object' && x !== null && !Array.isArray(x);

export const isString = (x: unknown): x is string => typeof x === 'string';

export const isNumber = (x: unknown): x is number => typeof x === 'number';

export const isBoolean = (x: unknown): x is boolean => x === true || x === false;

export const isDefined = <T>(arg: Nullable<T>): arg is Defined<T> =>
  arg !== undefined && arg !== null;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const isNever = (x: never) => {
  throw new Error('Missing case in exhaustive switch');
};

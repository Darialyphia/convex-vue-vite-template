export type Defined<T> = Exclude<T, undefined | null>;
export type Nullable<T> = T | null | undefined;
export type PartialBy<T, K extends keyof T = never> = Omit<T, K> & Partial<Pick<T, K>>;
export type Entries<T> = { [K in keyof T]: [K, T[K]] }[keyof T];
export type AnyObject = { [key: string]: any };
export type AnyFunction = (...args: any[]) => any;
export type Keys<T> = keyof T;
export type Values<T> = T[keyof T];
export type Override<A, B> = Omit<A, keyof B> & B;
export type AsyncReturnType<T extends (...args: any) => Promise<any>> = T extends (
  ...args: any
) => Promise<infer R>
  ? R
  : any;
export type MaybePromise<T> = T | Promise<T>;
/**
 * Hack! This type causes TypeScript to simplify how it renders object types.
 *
 * It is functionally the identity for object types, but in practice it can
 * simplify expressions like `A & B`.
 */
export type Expand<ObjectType extends Record<any, any>> = ObjectType extends Record<
  any,
  any
>
  ? {
      [Key in keyof ObjectType]: ObjectType[Key];
    }
  : never;

/**
 * An `Omit<>` type that:
 * 1. Applies to each element of a union.
 * 2. Preserves the index signature of the underlying type.
 */
export type BetterOmit<T, K extends keyof T> = {
  [Property in keyof T as Property extends K ? never : Property]: T[Property];
};

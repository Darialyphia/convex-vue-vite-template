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

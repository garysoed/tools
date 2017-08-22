export type SimpleProviderFn<T> = (() => T) | (() => Promise<T>);
export type ProviderFn<T> = ((...args: any[]) => T) | ((...args: any[]) => Promise<T>);

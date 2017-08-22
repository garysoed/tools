export type Provider<T> = ((...args: any[]) => T) | ((...args: any[]) => Promise<T>);
export type Provider0<T> = (() => T) | (() => Promise<T>);
export type Provider1<T, P0> = ((arg0: P0) => T) | ((arg0: P0) => Promise<T>);

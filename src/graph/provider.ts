export type Provider<T> = ((...args: any[]) => T) | ((...args: any[]) => Promise<T>);
export type Provider0<T> = (() => T) | (() => Promise<T>);
export type Provider1<T, P0> = ((arg0: P0) => T) | ((arg0: P0) => Promise<T>);
export type Provider2<T, P0, P1> =
    ((arg0: P0, arg1: P1) => T) | ((arg0: P0, arg1: P1) => Promise<T>);
export type Provider3<T, P0, P1, P2> =
    ((arg0: P0, arg1: P1, arg2: P2) => T) | ((arg0: P0, arg1: P1, arg2: P2) => Promise<T>);

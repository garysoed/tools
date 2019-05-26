type IfEquals<X, Y, A, B> =
    (<T>() => T extends X ? 1 : 2) extends
    (<T>() => T extends Y ? 1 : 2) ? A : B;

export type WritableKeysOf<T> = {
  [K in keyof T]: IfEquals<{[Q in K]: T[K]}, {-readonly [Q in K]: T[K]}, K, never>
}[keyof T];

export type Setter<O, S> = {[K in WritableKeysOf<O>]: (newValue: O[K]) => Partial<S>};

export interface Ctor<O, S> {
  new (serializable: S): O;
  prototype: O;
}

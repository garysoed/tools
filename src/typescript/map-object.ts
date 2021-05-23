import {Mutable} from './mutable';

type SameKey<O> = {readonly [K in keyof O]: unknown};

type Replaced<F, T extends SameKey<F>> = {
  readonly [K in keyof F]: T[K];
};


export function mapObject<F, T extends SameKey<F>>(
    target: F,
    mapFn: <K extends Extract<keyof F, string>>(key: K, value: F[K]) => T[K],
): Replaced<F, T> {
  const partial: Partial<Mutable<T>> = {};
  for (const key in target) {
    partial[key] = mapFn(key, target[key]);
  }

  return partial as T;
}

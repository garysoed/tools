import { Operator } from './operator';

type FiniteIterable<T> = readonly T[]|ReadonlySet<T>;

export function some(): Operator<FiniteIterable<boolean>, boolean> {
  return iterable => [...iterable].some(value => value);
}

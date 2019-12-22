import { Operator } from './operator';

type FiniteIterable<T> = readonly T[]|ReadonlySet<T>;

export function every(): Operator<FiniteIterable<boolean>, boolean> {
  return iterable => [...iterable].every(value => value);
}

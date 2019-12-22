import { Operator } from './operator';

export function asSet<T>(): Operator<Iterable<T>, Set<T>> {
  return iterable => new Set(iterable);
}

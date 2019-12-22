import { Operator } from './operator';

export function asArray<T>(): Operator<Iterable<T>, T[]> {
  return iterable => [...iterable];
}

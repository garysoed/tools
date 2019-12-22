import { filter } from './filter';
import { Operator } from './operator';

export function filterNonNull<T>(): Operator<Iterable<T>, Iterable<Exclude<T, null>>> {
  return filter((item): item is Exclude<T, null> => item !== null);
}

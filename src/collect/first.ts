import { Operator } from './operator';
import { take } from './take';

export function first<T>(): Operator<Iterable<T>, T|null> {
  return (iterable: Iterable<T>) => {
    return [...take<T>(1)(iterable)][0] || null;
  };
}

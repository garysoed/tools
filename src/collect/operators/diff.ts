import { asSet } from './as-set';
import { filter } from './filter';
import { Operator } from './operator';
import { $pipe } from './pipe';

export function diff<T>(other: ReadonlySet<T>): Operator<Iterable<T>, ReadonlySet<T>> {
  return iterable => $pipe(iterable, filter(item => !other.has(item)), asSet());
}

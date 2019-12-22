import { asSet } from './as-set';
import { $ } from './chain';
import { filter } from './filter';
import { Operator } from './operator';

export function diff<T>(other: ReadonlySet<T>): Operator<Iterable<T>, ReadonlySet<T>> {
  return iterable => $(iterable, filter(item => !other.has(item)), asSet());
}

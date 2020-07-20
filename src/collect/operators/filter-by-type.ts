import { Type } from 'gs-types';

import { filter } from './filter';
import { Operator } from './operator';

export function filterByType<T>(type: Type<T>): Operator<Iterable<unknown>, Iterable<T>> {
  return filter((item): item is T => type.check(item));
}

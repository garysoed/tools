import { Type } from 'gs-types';

import { Operator } from './operator';
import { filter } from './filter';

/**
 * Returns elements in the {@link Iterable} of the given {@link Type}.
 *
 * @typeParam T - Expected type of item.
 * @param type - Expected type of the item.
 * @returns Operator that returns elements of the given `Type`.
 * @thModule collect.operators
 */
export function filterByType<T>(type: Type<T>): Operator<Iterable<unknown>, Iterable<T>> {
  return filter((item): item is T => type.check(item));
}

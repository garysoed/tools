import {$asSet} from './as-set';
import {$filter} from './filter';
import {Operator} from './operator';
import {$pipe} from './pipe';

/**
 * Returns elements that are in the original {@link Iterable} but not in the given set.
 *
 * @typeParam T - Type of item.
 * @param other - Set to compare to.
 * @returns Operator that returns elements that are in the original `Iterable` but not in the given
 *     set.
 *
 * @thModule collect.operators
 */
export function $subtract<T>(other: ReadonlySet<T>): Operator<Iterable<T>, ReadonlySet<T>> {
  return iterable => $pipe(iterable, $filter(item => !other.has(item)), $asSet());
}

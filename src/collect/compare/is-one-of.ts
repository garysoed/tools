import { Ordering } from './ordering';
import { matches } from './matches';

/**
 * Orders items matching the given list at the start of the list.
 *
 * @typeParam T - Type of item to order.
 * @returns Ordering that sorts item earlier if it matches one of the given items.
 * @thModule collect.compare
 */
export function isOneOf<T>(checkedSet: ReadonlySet<T>): Ordering<T> {
  return matches(item => checkedSet.has(item));
}

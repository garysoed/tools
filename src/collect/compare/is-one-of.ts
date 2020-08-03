import { matches } from './matches';
import { Ordering } from './ordering';

/**
 * Orders items matching the given list at the start of the list.
 */
export function isOneOf<T>(checkedSet: ReadonlySet<T>): Ordering<T> {
  return matches(item => checkedSet.has(item));
}

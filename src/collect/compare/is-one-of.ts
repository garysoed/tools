import { matches } from './matches';
import { Ordering } from './ordering';

/**
 * Orders items matching the given list at the start of the list.
 */
export function isOneOf<T>(checked: Iterable<T>): Ordering<T> {
  const checkedSet = new Set(checked);

  return matches(item => checkedSet.has(item));
}

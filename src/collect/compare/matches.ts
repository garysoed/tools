import { CompareResult } from './compare-result';
import { Ordering } from './ordering';

/**
 * Returns function that orders items at the front iif the predicate returns true for them.
 *
 * @typeParam T - Type of item to check.
 * @param predicate - Predicate function to determine the ordering of items.
 * @returns Function that orders items at the front iif the predicate returns true for them.
 * @thModule collect.compare
 */
export function matches<T>(predicate: (input: T) => boolean): Ordering<T> {
  return (item1: T, item2: T): CompareResult => {
    const matches1 = predicate(item1);
    const matches2 = predicate(item2);
    if (matches1 === matches2) {
      return 0;
    }

    return (matches1 && !matches2) ? -1 : 1;
  };
}

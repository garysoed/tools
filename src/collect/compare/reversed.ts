import {CompareResult} from './compare-result';
import {Ordering} from './ordering';

/**
 * Returns `Ordering` that reverses the ordering.
 *
 * @typeParam T - Type of items to sort.
 * @param ordering - Ordering function to reverse.
 * @returns `Ordering` object that reverses the ordering of the given `Ordering`.
 * @thModule collect.compare
 */
export function reversed<T>(ordering: Ordering<T>): Ordering<T> {
  return (item1: T, item2: T): CompareResult => {
    return ordering(item2, item1);
  };
}

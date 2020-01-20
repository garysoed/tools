import { CompareResult } from './compare-result';
import { Ordering } from './ordering';

/**
 * Ordering by comparators `<` and `>`.
 *
 * For numbers, this is the natural ordering of the number.
 * For strings, this is the alphabetical ordering.
 * For booleans, this ordering treats `false` as smaller.
 */
export function normal<T>(): Ordering<T> {
  return (item1: T, item2: T): CompareResult => {
    if (item1 < item2) {
      return -1;
    } else if (item1 > item2) {
      return 1;
    } else {
      return 0;
    }
  };
}

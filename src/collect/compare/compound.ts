import {CompareResult} from './compare-result';
import {Ordering} from './ordering';

/**
 * Returns function to sort items by the given array of `Ordering`s.
 *
 * @remarks
 * The given array of `Ordering`s are used for tie breaking.
 *
 * @typeParam T - Type of items to compare.
 * @param orderings - Orderings to check.
 * @returns Ordering object that uses the given array of `Ordering`s to break ties.
 * @thModule collect.compare
 */
export function compound<T>(
  orderings: ReadonlyArray<Ordering<T>>,
): Ordering<T> {
  return (item1: T, item2: T): CompareResult => {
    for (const ordering of orderings) {
      const result = ordering(item1, item2);
      if (result !== 0) {
        return result;
      }
    }

    return 0;
  };
}

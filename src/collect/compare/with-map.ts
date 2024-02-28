import {CompareResult} from './compare-result';
import {Ordering} from './ordering';

/**
 * Returns ordering after mapping.
 *
 * @remarks
 * This applies the mapping function to every item, then uses the given `Ordering` to figure out
 * the ordering.
 *
 * @typeParam T1 - Type of item to sort.
 * @typeParam T2 - Output type of the mapping function.
 * @param mapFn - The mapping function.
 * @param ordering - Ordering to apply.
 * @returns Ordering that applies the mapping function before passing it to the given `Ordering`.
 * @thModule collect.compare
 */
export function withMap<T1, T2>(
  mapFn: (input: T1) => T2,
  ordering: Ordering<T2>,
): Ordering<T1> {
  return (item1: T1, item2: T1): CompareResult => {
    return ordering(mapFn(item1), mapFn(item2));
  };
}

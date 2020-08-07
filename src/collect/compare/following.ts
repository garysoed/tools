import { CompareResult } from './compare-result';
import { normal } from './normal';
import { Ordering } from './ordering';

/**
 * Returns function to sort items by equality with the given array of items.
 *
 * @remarks
 * The returned function will try to sort items in the same order as the given array of items. Items
 * that are not in the given array will be treated as equal value.
 *
 * @typeParam T - Type of items to compare.
 * @param specs - Array of items to compare.
 * @returns Function that tries to sort the items following the order of the given array of items.
 * @thModule collect.compare
 */
export function following<T>(specs: readonly T[]): Ordering<T> {
  const ordering = new Map<T, number>();
  for (let i = 0; i < specs.length; i++) {
    ordering.set(specs[i], i);
  }

  const normalOrdering = normal();

  return (item1, item2): CompareResult => {
    const ordinal1 = ordering.get(item1);
    const ordinal2 = ordering.get(item2);
    if (ordinal1 === undefined) {
      return 0;
    }

    if (ordinal2 === undefined) {
      return 0;
    }

    return normalOrdering(ordinal1, ordinal2);
  };
}

import {Operator} from '../../typescript/operator';
import {Ordering} from '../compare/ordering';

/**
 * Returns the largest element in the given array.
 *
 * @typeParam T - Type of the element.
 * @param ordering - Ordering function to use
 * @returns The largest element in the given array.
 * @thModule collect.operators
 */
export function $max<T>(
  ordering: Ordering<T>,
): Operator<readonly T[], T | null> {
  return (obj) => {
    let max = null;
    for (const item of obj) {
      if (max === null) {
        max = item;
        continue;
      }

      const result = ordering(max, item);
      if (result >= 0) {
        continue;
      }

      max = item;
    }

    return max;
  };
}

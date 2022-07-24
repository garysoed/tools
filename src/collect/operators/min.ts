import {Operator} from '../../typescript/operator';
import {Ordering} from '../compare/ordering';


/**
 * Returns the smallest element in the given array.
 *
 * @typeParam T - Type of the element.
 * @param ordering - Ordering function to use
 * @returns The smallest element in the given array.
 * @thModule collect.operators
 */
export function $min<T>(ordering: Ordering<T>): Operator<readonly T[], T|null> {
  return obj => {
    let min = null;
    for (const item of obj) {
      if (min === null) {
        min = item;
        continue;
      }

      const result = ordering(min, item);
      if (result <= 0) {
        continue;
      }

      min = item;
    }

    return min;
  };
}

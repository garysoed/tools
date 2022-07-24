import {Operator} from '../../typescript/operator';
import {Ordering} from '../compare/ordering';


/**
 * Sorts the given `Array`.
 *
 * @typeParam T - Type of the items to sort.
 * @param ordering - Object that determines how to sort the items.
 * @returns `Ordering` that sorts the given `Array`.
 * @thModule collect.operators
 */
export function $sort<T>(ordering: Ordering<T>): Operator<readonly T[], readonly T[]> {
  return array => [...array].sort(ordering);
}

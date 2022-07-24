import {Operator} from '../../typescript/operator';

/**
 * Reverses the items in the given {@link Array}.
 *
 * @typeParam T - Type of items in the `Array`.
 * @returns `Operator` that reverses the items in the `Array`.
 * @thModule collect.operators
 */
export function $reverse<T>(): Operator<readonly T[], readonly T[]> {
  return array => [...array].reverse();
}

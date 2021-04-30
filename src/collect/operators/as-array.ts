import {Operator} from './operator';

/**
 * Converts the {@link Iterable} to an {@link Array}.
 *
 * @typeParam T - Type of items in the array.
 * @returns `Operator` to convert `Iterable` to arrays.
 * @thModule collect.operators
 */
export function $asArray<T>(): Operator<Iterable<T>, T[]> {
  return iterable => [...iterable];
}

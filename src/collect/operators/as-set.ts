import {Operator} from '../../typescript/operator';

/**
 * Converts the {@link Iterable} to a {@link Set}.
 *
 * @typeParam T - Type of items in the set.
 * @returns `Operator` to convert `Iterable`s to sets.
 * @thModule collect.operators
 */
export function $asSet<T>(): Operator<Iterable<T>, Set<T>> {
  return (iterable) => new Set(iterable);
}

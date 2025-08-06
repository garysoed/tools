import {Operator} from '../../typescript/operator';

import {$take} from './take';

/**
 * Returns the first element in the {@link Iterable}, or null if there are none.
 *
 * @typeParam T - Type of item in the given `Iterable`.
 * @returns `Operator` that returns the first element in the iterable, or null if there are none.
 * @thModule collect.operators
 */
export function $first<T>(): Operator<Iterable<T>, null | T> {
  return (iterable: Iterable<T>) => {
    return [...$take<T>(1)(iterable)][0] ?? null;
  };
}

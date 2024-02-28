import {Operator} from '../../typescript/operator';

import {FiniteIterable} from './finite-iterable';

/**
 * Returns `true` iff at least one element in the given {@link Iterable} is `true`.
 *
 * @returns `Operator` that returns `true` iff at least one element in the given `Iterable` is
 *     `true`.
 * @thModule collect.operators
 */
export function $some(): Operator<FiniteIterable<boolean>, boolean> {
  return (iterable) => [...iterable].some((value) => value);
}

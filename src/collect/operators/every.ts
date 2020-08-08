import { FiniteIterable } from './finite-iterable';
import { Operator } from './operator';

/**
 * Returns `true` iff all the elements in the collection is `true`.
 *
 * @remarks
 * The given collection needs to have a finite size.
 *
 * @returns Operator that returns `true` iff all the elements in the it6erable is `true`.
 * @thModule collect.operators
 */
export function every(): Operator<FiniteIterable<boolean>, boolean> {
  return iterable => [...iterable].every(value => value);
}

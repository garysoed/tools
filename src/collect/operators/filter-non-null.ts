import { filter } from './filter';
import { Operator } from './operator';

/**
 * Filters out any `null`s from the {@link Iterable}.
 *
 * @typeParam T - Type of item in the input `Iterable` that is not `null`.
 * @returns Operator that filters out any `null`.
 * @thModule collect.operators
 */
export function filterNonNull<T>(): Operator<Iterable<T>, Iterable<Exclude<T, null>>> {
  return filter((item): item is Exclude<T, null> => item !== null);
}

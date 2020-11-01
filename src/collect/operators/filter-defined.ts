import { Operator } from './operator';
import { filter } from './filter';

/**
 * Filters out any `undefined`.
 *
 * @typeParam T - Type of item in the input `Iterable` that is not `undefined`.
 * @returns Operator that filters out any `undefined`.
 *
 * @thModule collect.operators
 */
export function filterDefined<T>():
    Operator<Iterable<T>, Iterable<Exclude<T, undefined>>> {
  return filter((item): item is Exclude<T, undefined> => item !== undefined);
}

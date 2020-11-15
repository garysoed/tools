import {Operator} from './operator';

/**
 * Filters out items that do not fulfill the given predicate.
 *
 * @remarks
 * The given predicate can use type guard to set the value of the returned {@link Iterable}.
 *
 * @typeParam T1 - Type of item in the `Iterable`.
 * @typeParam T2 - Type of `Iterable` whose items pass the given predicate, if the predicate has
 *     a type guard.
 * @param predicate - Function that takes in an item and returns true iff the item should be in the
 *     resulting `Iterable`.
 * @returns `Operator` that filters out items that do not fulfill the given predicate.
 * @thModule collect.operators
 */
export function filter<T1, T2 extends T1>(predicate: (item: T1) => item is T2):
    Operator<Iterable<T1>, Iterable<T2>>;
/**
 * @typeParam T - Type of item in the `Iterable`.
 * @param predicate - Function that takes in an item and returns true iff the item should be in the
 *     resulting `Iterable`.
 * @returns `Operator` that filters out items that do not fulfill the given predicate.
 */
export function filter<T>(predicate: (item: T) => boolean): Operator<Iterable<T>, Iterable<T>>;
export function filter<T>(predicate: (item: T) => boolean): Operator<Iterable<T>, Iterable<T>> {
  return iterable => {
    return (function*(): Generator<T> {
      for (const item of iterable) {
        if (predicate(item)) {
          yield item;
        }
      }
    })();
  };
}

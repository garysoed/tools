import {Operator} from '../../typescript/operator';

/**
 * Returns the first item that fulfills the given predicate.
 *
 * @remarks
 * The given predicate can use type guard to set the value of the returned {@link Iterable}.
 *
 * This is the same as {@link filter}, except it shortcuts after finding the first matching item.
 *
 * @typeParam T1 - Type of item in the `Iterable`.
 * @typeParam T2 - Type of `Iterable` whose items pass the given predicate, if the predicate has
 *     a type guard.
 * @param predicate - Function that takes in an item and returns true iff the item should be found.
 * @returns `Operator` that returns the first item that fulfills the given predicate, or `undefined`
 *     if such item cannot be found.
 * @thModule collect.operators
 */
export function $find<T1, T2 extends T1>(predicate: (item: T1) => item is T2):
    Operator<Iterable<T1>, T2|undefined>;
/**
 * @typeParam T - Type of item in the `Iterable`.
 * @param predicate - Function that takes in an item and returns true iff the item should be found.
 * @returns `Operator` that returns the first item that fulfills the given predicate, or `undefined`
 *     if such item cannot be found.
 */
export function $find<T>(predicate: (item: T) => boolean): Operator<Iterable<T>, T|undefined>;
export function $find<T>(predicate: (item: T) => boolean): Operator<Iterable<T>, T|undefined> {
  return iterable => {
    for (const item of iterable) {
      if (predicate(item)) {
        return item;
      }
    }

    return undefined;
  };
}

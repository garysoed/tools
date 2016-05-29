import {FluentNonIndexable, NonIndexables} from './non-indexables';
import {Iterables} from './iterables';


/**
 * Collection of methods to help manipulate sets.
 *
 * The general flow is to input a set, do a bunch of transformations, and output the transformed
 * set at the end. Note that the input set should never be used again. This class does not make any
 * guarantee that it will / will not modify the input set.
 *
 * Example:
 *
 * ```typescript
 * Set
 *     .fromArray([1, 2, 3])
 *     .data;  // Set([1, 2, 3])
 * ```
 *
 * Note that every value in the set must be of the same type.
 */
export class Sets {
  /**
   * Starts by using an array object.
   *
   * @param <T> Type of the array element.
   * @param array Array object to start from.
   * @return Set wrapper object to do operations on.
   */
  static fromArray<T>(array: T[]): FluentNonIndexable<T> {
    return NonIndexables.fromIterable<T>(new Set<T>(array));
  }

  /**
   * Starts by using a set.
   *
   * @param <T> Type of the set element.
   * @param data The set object to start with.
   * @return Set wrapper object to do operations on.
   */
  static of<T>(set: Set<T>): FluentNonIndexable<T> {
    return NonIndexables.fromIterable<T>(set);
  }
};

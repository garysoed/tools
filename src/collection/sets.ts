import BaseFluent from './base-fluent';

/**
 * Chainable object to manipulate a set.
 *
 * @param <T> The type of element in the set.
 */
export class FluentSet<T> extends BaseFluent<Set<T>> {
  /**
   * @param data The underlying set to modify.
   */
  constructor(data: Set<T>) {
    super(data);
  }
};

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
class Sets {
  /**
   * Starts by using an array object.
   *
   * @param <T> Type of the array element.
   * @param array Array object to start from.
   * @return Set wrapper object to do operations on.
   */
  static fromArray<T>(array: T[]): FluentSet<T> {
    return Sets.of<T>(new Set<T>(array));
  }

  /**
   * Starts by using a set.
   *
   * @param <T> Type of the set element.
   * @param data The set object to start with.
   * @return Set wrapper object to do operations on.
   */
  static of<T>(set: Set<T>): FluentSet<T> {
    return new FluentSet(set);
  }
};

export default Sets;

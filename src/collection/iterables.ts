/// @doc
import BaseFluent from './base-fluent';

/**
 * Chainable object to manipulate an iterable.
 *
 * @param <T> The type of element in the iterable.
 */
export class FluentIterable<T> extends BaseFluent<Iterable<T>> {

  /**
   * @param data The underlying iterable object to modify.
   */
  constructor(data: Iterable<T>) {
    super(data);
  }

  /**
   * Executes the given function on every element in the iterable.
   *
   * This is a polyfill of `for..of` function with ability to break out of the loop midway.
   *
   * @param fn The function to execute on every element of the iterable. This accepts two arguments:
   *
   * 1.  Element in the iterable.
   * 1.  Function called to break out of the loop.
   *
   * @return [[FluentIterable]] instance for chaining.
   */
  forOf(fn: (value: T, breakFn: () => void) => void): FluentIterable<T> {
    let iterator = this.data[Symbol.iterator]();
    let shouldBreak = false;
    for (let result = iterator.next(); !result.done && !shouldBreak; result = iterator.next()) {
      fn(result.value, () => {
        shouldBreak = true;
      });
    }
    return this;
  }
}

/**
 * Collection of methods to help manipulate iterables.
 *
 * The general flow is to input an iterable, do a bunch of transformations, and output the
 * transformed iterable at the end. Note that the input iterable should never be used again. This
 * class does not make any guarantee that it will / will not modify the input iterable.
 *
 * Example:
 *
 * ```javascript
 * Iterables
 *     .of(['a', 'b', 'c'])
 *     .forOf((value: string, breakFn: () => void) => {
 *       console.log(value);
 *     });
 * ```
 *
 * Note that every element in the iterable must be of the same type.
 */
export default {
  /**
   * Starts by using an iterable.
   *
   * @param <T> Type of the iterable element.
   * @param data The iterable object to start with.
   * @return Iterable wrapper object to do operations on.
   */
  of<T>(data: Iterable<T>): FluentIterable<T> {
    return new FluentIterable<T>(data);
  },
}

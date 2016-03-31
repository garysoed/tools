/// @doc

import BaseFluent from './base-fluent';
import Iterables from './iterables';
import Records from './records';
import Sets from './sets';

export class FluentArrays<T> extends BaseFluent<T[]> {
  constructor(data: T[]) {
    super(data);
  }

  diff(toRemove: T[]): FluentArrays<T> {
    let toRemoveSet = Sets.fromArray(toRemove).data;
    let result = [];

    this.forOf((value: T) => {
      if (!toRemoveSet.has(value)) {
        result.push(value);
      }
    });

    return new FluentArrays(result);
  }

  forOf(fn: (value: T, breakFn: () => void) => void): FluentArrays<T> {
    Iterables.of<T>(this.data).forOf(fn);
    return this;
  }
}

/**
 * Collection of methods to help manipulate arrays.
 *
 * The general flow is to input an array, do a bunch of transformations, and output the transformed
 * array at the end. Note that the input array should never be used again. This class does not make
 * any guarantee that it will / will not modify the input array.
 *
 * Example:
 *
 * ```javascript
 * Arrays
 *     .of(['a', 'b', 'c'])
 *     .diff(['b', 'c'])
 *     .data;  // ['a']
 * ```
 *
 * Note that every element in the array must be of the same type.
 */
const Arrays = {
  /**
   * Starts by using any `Iterable` objects.
   *
   * @param <T> Type of the array element.
   * @param iterable Iterable object to start from.
   * @return Array wrapper object to do operations on.
   */
  fromIterable<T>(iterable: Iterable<T>): FluentArrays<T> {
    let array = [];
    Iterables.of(iterable).forOf((value: T) => {
      array.push(value);
    });
    return Arrays.of(array);
  },

  /**
   * Starts by using any `Object`s with numerical index, and a property called `length` that returns
   * the number of entries in the object.
   *
   * @param <T> Type of the array element.
   * @param data The object with numerical index and a property called `length` that returns the
   *    number of entries in the object.
   * @return Array wrapper object to do operations on.
   */
  fromNumericalIndexed<T>(data: {[index: number]: T, length: number}): FluentArrays<T> {
    let array = [];
    for (let i = 0; i < data.length; i++) {
      array.push(data[i]);
    }
    return Arrays.of(array);
  },

  /**
   * Starts by using the keys of a record. Records are objects with `string` indexing.
   *
   * @param <T> Type of the array element.
   * @param record The record object whose keys will be used to create the array.
   * @return Array wrapper object to do operations on.
   */
  fromRecordKeys(record: {[key: string]: any}): FluentArrays<string> {
    let array = [];
    Records
        .of(record)
        .forEach((value: any, key: string) => {
          array.push(key);
        });
    return Arrays.of(array);
  },

  /**
   * Starts by using the values of a record. Records are objects with `string` indexing. The values
   * of the record must be of the same type.
   *
   * @param <T> Type of the array element.
   * @param record The record object whose values will be used to create the array.
   * @return Array wrapper object to do operations on.
   */
  fromRecordValues<T>(record: {[key: string]: T}): FluentArrays<T> {
    let array = [];
    Records
        .of(record)
        .forEach((value: T, key: string) => {
          array.push(value);
        });
    return Arrays.of(array);
  },

  /**
   * Starts by using an array.
   *
   * @param <T> Type of the array element.
   * @param data The array object to start with.
   * @return Array wrapper object to do operations on.
   */
  of<T>(data: T[]): FluentArrays<T> {
    return new FluentArrays<T>(data);
  },
};

export default Arrays;

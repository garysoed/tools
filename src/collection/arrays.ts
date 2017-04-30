import { FluentIndexable } from './indexables';


/**
 * Collection of methods to help manipulate arrays.
 *
 * The general flow is to input an array, do a bunch of transformations, and output the transformed
 * array at the end. Note that the input array should never be used again. This class does not make
 * any guarantee that it will / will not modify the input array.
 *
 * Example:
 *
 * ```typescript
 * Arrays
 *     .of(['a', 'b', 'c'])
 *     .map((value: string) => value + '1')
 *     .asArray();  // ['a1', 'b1', 'c1']
 * ```
 *
 * Note that every element in the array must be of the same type.
 */
export class Arrays {
  /**
   * Flattens an array of arrays into an array.
   *
   * @param items The array of arrays to flatten.
   * @return Array wrapper object to do operations on.
   */
  static flatten<T>(items: T[][]): FluentIndexable<T> {
    const array: T[] = [];
    Arrays
        .of(items)
        .forEach((values: T[]) => {
          Arrays
              .of(values)
              .forEach((value: T) => {
                array.push(value);
              });
        });
    return Arrays.of(array);
  }

  /**
   * Starts by using an object with length and item method to get the item.
   *
   * @param list The object to start from.
   * @param <T> Type of element in the collection.
   * @return Array wrapper object to do operations on.
   */
  static fromItemList<T>(list: {length: number, item: (index: number) => T}): FluentIndexable<T> {
    const array: T[] = [];
    for (let i = 0; i < list.length; i++) {
      array.push(list.item(i));
    }
    return Arrays.of(array);
  }

  /**
   * Starts by using a (finite) iterable.
   *
   * @param <T> Type of the array element.
   * @param iterable The iterable containing the elements.
   * @return Array wrapper object to do operations on.
   */
  static fromIterable<T>(iterable: Iterable<T>): FluentIndexable<T> {
    return Arrays.fromIterator<T>(iterable[Symbol.iterator]());
  }

  /**
   * Starts by using a (finite) iterator.
   *
   * @param <T> Type of the array element.
   * @param iterator The iterator containing the elements.
   * @return Array wrapper object to do operations on.
   */
  static fromIterator<T>(iterator: Iterator<T>): FluentIndexable<T> {
    const array: T[] = [];
    for (let entry = iterator.next(); !entry.done; entry = iterator.next()) {
      array.push(entry.value);
    }
    return Arrays.of(array);
  }

  /**
   * Starts from an object with numerical index.
   *
   * @param list The object to start from.
   * @param <T> Type of the array element.
   * @return Array wrapper object to do operations on.
   */
  static fromNumericIndexable<T>(list: {[index: number]: T, length: number}): FluentIndexable<T> {
    const array: T[] = [];
    for (let i = 0; i < list.length; i++) {
      array.push(list[i]);
    }
    return Arrays.of(array);
  }

  /**
   * Starts by using an array.
   *
   * @param <T> Type of the array element.
   * @param data The array object to start with.
   * @return Array wrapper object to do operations on.
   */
  static of<T>(data: T[]): FluentIndexable<T> {
    return new FluentIndexable<T>(data.slice());
  }
}

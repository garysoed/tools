/**
 * Iterable related utilities.
 */
import { HasPropertyType } from '../check/has-property-type';
import { IType } from '../check/i-type';
import { InstanceofType } from '../check/instanceof-type';

export class Iterables {
  static ITERATOR_TYPE: IType<Iterator<any>> =
      HasPropertyType<Iterator<any>>('next', InstanceofType(Function));

  static clone<T>(iterable: Iterable<T>): Iterable<T> {
    return {
      * [Symbol.iterator](): Iterator<T> {
        for (const value of iterable) {
          yield value;
        }
      },
    };
  }

  static of<T>(generator: () => Iterator<T>): Iterable<T>;
  static of<T>(iterator: Iterator<T>): Iterable<T>;
  static of<T>(data: Iterator<T> | (() => Iterator<T>)): Iterable<T> {
    if (Iterables.ITERATOR_TYPE.check(data)) {
      return {
        [Symbol.iterator](): Iterator<T> {
          return data;
        },
      };
    } else {
      return Iterables.of<T>(data());
    }
  }
}

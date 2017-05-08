/**
 * Iterable related utilities.
 */
import { HasPropertyType } from '../check/has-property-type';
import { IType } from '../check/i-type';
import { InstanceofType } from '../check/instanceof-type';
import { Finite } from '../interfaces/finite';
import { assertUnreachable } from '../typescript/assert-unreachable';

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
    } else if (data instanceof Function) {
      return Iterables.of<T>(data());
    } else {
      throw assertUnreachable(data);
    }
  }

  static toArray<T>(iterable: Iterable<T> & Finite<T>): T[] {
    const array: T[] = [];
    for (const item of iterable) {
      array.push(item);
    }
    return array;
  }
}

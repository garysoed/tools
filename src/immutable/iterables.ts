import { AnyType, HasPropertiesType, InstanceofType, IterableOfType, StringType, Type } from '@gs-types';
import { assertUnreachable } from '../typescript/assert-unreachable';

export class Iterables {
  static ITERATOR_TYPE: Type<Iterator<any>> =
      HasPropertiesType<Iterator<any>>({
        next: InstanceofType<(value?: any) => IteratorResult<any>>(Function),
      });

  static clone<T>(iterable: Iterable<T>): Iterable<T> {
    return {
      * [Symbol.iterator](): Iterator<T> {
        for (const value of iterable) {
          yield value;
        }
      },
    };
  }

  static flatten<T>(iterables: Iterable<Iterable<T>>): Iterable<T> {
    const output: T[] = [];
    for (const iterable of iterables) {
      for (const item of iterable) {
        output.push(item);
      }
    }

    return output;
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

  static unsafeEquals<T>(iterable1: Iterable<T>, iterable2: Iterable<T>): boolean {
    const array1 = [...iterable1];
    const array2 = [...iterable2];
    if (array1.length !== array2.length) {
      return false;
    }

    for (let i = 0; i < array1.length; i++) {
      const item1 = array1[i];
      const item2 = array2[i];
      if (IterableOfType(AnyType()).check(item1) &&
          !StringType.check(item1) &&
          IterableOfType(AnyType()).check(item2) &&
          !StringType.check(item2) &&
          Iterables.unsafeEquals(item1, item2)) {
        continue;
      }

      if (item1 !== item2) {
        return false;
      }
    }

    return true;
  }
}

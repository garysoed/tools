import { HasPropertyType, InstanceofType, IterableType, IType, StringType } from '../check';
import { assertUnreachable } from '../typescript';

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

  static unsafeEquals<T>(iterable1: Iterable<T>, iterable2: Iterable<T>): boolean {
    const array1 = [...iterable1];
    const array2 = [...iterable2];
    if (array1.length !== array2.length) {
      return false;
    }

    for (let i = 0; i < array1.length; i++) {
      const item1 = array1[i];
      const item2 = array2[i];
      if (IterableType.check(item1) &&
          !StringType.check(item1) &&
          IterableType.check(item2) &&
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

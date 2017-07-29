import { HasPropertyType, InstanceofType, IType } from '../check';
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
}

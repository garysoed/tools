import { Collection } from '../immutable/collection';

export class GeneratedLinkedList<T> implements Collection<T>, Iterable<T> {
  constructor(
      private readonly generator_: () => Iterator<T>) { }

  [Symbol.iterator](): Iterator<T> {
    return this.generator_();
  }

  filter(checker: (item: T) => boolean): GeneratedLinkedList<T> {
    return new GeneratedLinkedList<T>(function*(): Iterator<T> {
      for (const value of this) {
        if (checker(value)) {
          yield value;
        }
      }
    }.bind(this));
  }

  map<R>(fn: (item: T) => R): GeneratedLinkedList<R> {
    const iterator = this.generator_();
    return new GeneratedLinkedList<R>(function*(): Iterator<R> {
      for (const value of this) {
        yield fn(value);
      }
    }.bind(this));
  }
}

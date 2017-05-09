import { Iterables } from '../immutable/iterables';
import { Collection } from '../interfaces/collection';

export class GeneratedLinkedList<T> implements Collection<T>, Iterable<T> {
  constructor(private readonly iterable_: Iterable<T>) { }

  [Symbol.iterator](): Iterator<T> {
    return this.iterable_[Symbol.iterator]();
  }

  filterItem(checker: (item: T) => boolean): GeneratedLinkedList<T> {
    const iterable = this;
    return new GeneratedLinkedList<T>(Iterables.of(function*(): Iterator<T> {
      for (const value of iterable) {
        if (checker(value)) {
          yield value;
        }
      }
    }));
  }

  mapItem<R>(fn: (item: T) => R): GeneratedLinkedList<R> {
    const iterable = this;
    return new GeneratedLinkedList<R>(Iterables.of(function*(): Iterator<R> {
      for (const value of iterable) {
        yield fn(value);
      }
    }));
  }
}

import { Type } from '../check';
import { Iterables } from '../immutable/iterables';
import { Collection } from '../interfaces/collection';

export class GeneratedLinkedList<T> implements Collection<T> {
  constructor(private readonly iterable_: Iterable<T>) { }

  [Symbol.iterator](): Iterator<T> {
    return this.iterable_[Symbol.iterator]();
  }

  filterByType<T2>(checker: Type<T2>): GeneratedLinkedList<T2> {
    const iterable = this;
    return new GeneratedLinkedList<T2>(Iterables.of(function*(): Iterator<T2> {
      for (const value of iterable) {
        if (checker.check(value)) {
          yield value;
        }
      }
    }));
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

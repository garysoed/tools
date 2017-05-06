import { GeneratedLinkedList } from '../immutable/generated-linked-list';
import { Iterables } from '../immutable/iterables';
import { Collection } from '../interfaces/collection';
import { Indexed } from '../interfaces/indexed';

export class InfiniteList<T> implements Collection<T>, Indexed<number, T>, Iterable<T> {
  /**
   * @param generator_ Function the elements in the list, given a key. If the return value is
   *     undefined, the element should not be added to the list.
   */
  constructor(
      private readonly generator_: (index: number) => T | undefined) { }

  * [Symbol.iterator](): Iterator<T> {
    for (const entry of this.entries()) {
      yield entry[1];
    }
  }

  entries(): GeneratedLinkedList<[number, T]> {
    const generator = this.generator_;
    return new GeneratedLinkedList<[number, T]>(Iterables.of(function*(): Iterator<[number, T]> {
      let index = -1;
      while (true) {
        let value;
        do {
          index++;
          value = generator(index);
        } while (value === undefined);
        yield [index, value];
      }
    }));
  }

  filter(checker: (value: T, index: number) => boolean): InfiniteList<T> {
    return new InfiniteList<T>(
        (index: number) => {
          const value = this.generator_(index);
          if (value === undefined) {
            return undefined;
          }

          return checker(value, index) ? value : undefined;
        });
  }

  filterItem(checker: (item: T) => boolean): InfiniteList<T> {
    return this.filter(checker);
  }

  get(index: number): T | undefined {
    return this.generator_(index);
  }

  keys(): GeneratedLinkedList<number> {
    return this.entries().mapItem((entry: [number, T]) => entry[0]);
  }

  map<R>(fn: (value: T, index: number) => R): InfiniteList<R> {
    return new InfiniteList<R>(
      (index: number) => {
        const value = this.generator_(index);
        if (value === undefined) {
          return undefined;
        }

        return fn(value, index);
      });
  }

  mapItem<R>(fn: (item: T) => R): InfiniteList<R> {
    return this.map(fn);
  }

  set(index: number, item: T): InfiniteList<T> {
    return this.map<T>((mapItem: T, mapIndex: number) => {
      return index === mapIndex ? item : mapItem;
    });
  }

  values(): GeneratedLinkedList<T> {
    return this.entries().mapItem((entry: [number, T]) => entry[1]);
  }
}

import { Collection } from '../immutable/collection';
import { GeneratedLinkedList } from '../immutable/generated-linked-list';
import { Indexed } from '../immutable/indexed';

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
    return new GeneratedLinkedList<[number, T]>(function*(): Iterator<[number, T]> {
      let index = -1;
      while (true) {
        let value;
        do {
          index++;
          value = this.generator_(index);
        } while (value === undefined);
        yield [index, value];
      }
    }.bind(this));
  }

  filter(checker: (item: T, index: number) => boolean): InfiniteList<T> {
    return new InfiniteList<T>(
        (index: number) => {
          const value = this.generator_(index);
          if (value === undefined) {
            return undefined;
          }

          return checker(value, index) ? value : undefined;
        });
  }

  get(index: number): T | undefined {
    return this.generator_(index);
  }

  keys(): GeneratedLinkedList<number> {
    return this.entries().map((entry: [number, T]) => entry[0]);
  }

  map<R>(fn: (item: T, index: number) => R): InfiniteList<R> {
    return new InfiniteList<R>(
      (index: number) => {
        const value = this.generator_(index);
        if (value === undefined) {
          return undefined;
        }

        return fn(value, index);
      });
  }

  set(index: number, item: T): InfiniteList<T> {
    return this.map<T>((mapItem: T, mapIndex: number) => {
      return index === mapIndex ? item : mapItem;
    });
  }

  values(): Collection<T> & Iterable<T> {
    return this.entries().map((entry: [number, T]) => entry[1]);
  }
}

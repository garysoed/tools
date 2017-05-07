import { Collection } from '../interfaces/collection';
import { CompareResult } from '../interfaces/compare-result';
import { Finite } from '../interfaces/finite';
import { FiniteIndexed } from '../interfaces/finite-indexed';
import { Indexed } from '../interfaces/indexed';
import { Ordered } from '../interfaces/ordered';

export class ImmutableList<T> implements
    Collection<T>,
    Finite<T>,
    FiniteIndexed<number, T>,
    Indexed<number, T>,
    Iterable<T>,
    Ordered<T> {
  private readonly data_: T[];

  private constructor(data: T[]) {
    this.data_ = data.slice(0);
  }

  [Symbol.iterator](): Iterator<T> {
    return this.data_[Symbol.iterator]();
  }

  add(item: T): ImmutableList<T> {
    const clone = this.data_.slice(0);
    clone.push(item);
    return new ImmutableList(clone);
  }

  addAll(items: Iterable<T> & Finite<T>): ImmutableList<T> {
    const clone = this.data_.slice(0);
    for (const item of items) {
      clone.push(item);
    }
    return new ImmutableList(clone);
  }

  delete(item: T): ImmutableList<T> {
    const clone = this.data_.slice(0);
    const index = clone.indexOf(item);
    if (index < 0) {
      return this;
    } else {
      clone.splice(index, 1);
      return new ImmutableList(clone);
    }
  }

  deleteAll(items: Iterable<T> & Finite<T>): ImmutableList<T> {
    const clone = this.data_.slice(0);
    for (const item of items) {
      const index = clone.indexOf(item);
      if (index >= 0) {
        clone.splice(index, 1);
      }
    }
    return new ImmutableList(clone);
  }

  deleteAllKeys(keys: Iterable<number> & Finite<number>): ImmutableList<T> {
    const toDeleteIndexes: number[] = [];
    for (const key of keys) {
      toDeleteIndexes.push(key);
    }
    toDeleteIndexes.sort((index1: number, index2: number) => {
      if (index1 > index2) {
        return 1;
      } else if (index1 < index2) {
        return -1;
      } else {
        return 0;
      }
    });

    const clone = this.data_.slice(0);
    for (const index of toDeleteIndexes.reverse()) {
      clone.splice(index, 1);
    }
    return new ImmutableList(clone);
  }

  deleteAt(index: number): ImmutableList<T> {
    return this.deleteKey(index);
  }

  deleteKey(key: number): ImmutableList<T> {
    const clone = this.data_.slice(0);
    clone.splice(key, 1);
    return new ImmutableList(clone);
  }

  entries(): ImmutableList<[number, T]> {
    const clone = this.data_.map((value: T, index: number) => {
      return [index, value] as [number, T];
    });
    return new ImmutableList(clone);
  }

  filter(checker: (value: T, index: number) => boolean): ImmutableList<T> {
    return new ImmutableList(this.data_.filter(checker));
  }

  filterItem(checker: (item: T) => boolean): ImmutableList<T> {
    return this.filter((value: T, index: number) => checker(value));
  }

  get(index: number): T | undefined {
    return this.data_[index];
  }

  has(item: T): boolean {
    return this.data_.indexOf(item) >= 0;
  }

  hasKey(key: number): boolean {
    return this.data_[key] !== undefined;
  }

  insertAllAt(index: number, items: Finite<T> & Iterable<T>): ImmutableList<T> {
    const toAdds: T[] = [];
    for (const toAdd of items) {
      toAdds.push(toAdd);
    }
    const clone = this.data_.slice(0);
    clone.splice(index, 0, ...toAdds);
    return new ImmutableList(clone);
  }

  insertAt(index: number, item: T): ImmutableList<T> {
    const clone = this.data_.slice(0);
    clone.splice(index, 0, item);
    return new ImmutableList(clone);
  }

  keys(): ImmutableList<number> {
    return new ImmutableList(this.data_.map((value: T, index: number) => index));
  }

  map<R>(fn: (value: T, index: number) => R): ImmutableList<R> {
    return new ImmutableList(this.data_.map(fn));
  }

  mapItem<R>(fn: (item: T) => R): ImmutableList<R> {
    return this.map<R>((value: T, index: number) => fn(value));
  }

  set(index: number, item: T): ImmutableList<T> {
    const clone = this.data_.slice(0);
    clone[index] = item;
    return new ImmutableList(clone);
  }

  size(): number {
    return this.data_.length;
  }

  sort(compareFn: (item1: T, item2: T) => CompareResult): ImmutableList<T> {
    const clone = this.data_.slice(0);
    return new ImmutableList(clone.sort(compareFn));
  }

  values(): ImmutableList<T> {
    return this;
  }

  static of<T>(data: T[]): ImmutableList<T> {
    return new ImmutableList(data);
  }
}

import { Type } from 'gs-types/export';
import { CompareResult, FiniteCollection, Ordered, Ordering } from '../interfaces';
import { ImmutableSet } from './immutable-set';
import { Orderings } from './orderings';

export class OrderedSet<T> implements FiniteCollection<T>, Ordered<T> {
  private readonly data_: T[];
  private readonly set_: Set<T>;

  private constructor(data: T[]) {
    this.data_ = data;
    this.set_ = new Set(data);
  }

  [Symbol.iterator](): Iterator<T> {
    return this.data_[Symbol.iterator]();
  }

  add(item: T): OrderedSet<T> {
    if (this.set_.has(item)) {
      return this;
    }

    const clone = this.data_.slice(0);
    clone.push(item);
    return new OrderedSet(clone);
  }

  addAll(items: FiniteCollection<T>): OrderedSet<T> {
    const clone = this.data_.slice(0);
    const itemsToAdd = items.filterItem((item: T) => !this.has(item));
    for (const item of itemsToAdd) {
      clone.push(item);
    }
    return new OrderedSet(clone);
  }

  delete(item: T): OrderedSet<T> {
    const index = this.data_.indexOf(item);
    if (index < 0) {
      return this;
    }

    const clone = this.data_.slice(0);
    clone.splice(index, 1);
    return new OrderedSet(clone);
  }

  deleteAll(items: FiniteCollection<T>): OrderedSet<T> {
    const clone = this.data_.slice(0);
    for (const item of items) {
      const index = clone.indexOf(item);
      if (index >= 0) {
        clone.splice(index, 1);
      }
    }
    return new OrderedSet(clone);
  }

  deleteAt(index: number): OrderedSet<T> {
    const clone = this.data_.slice(0);
    clone.splice(index, 1);
    return new OrderedSet(clone);
  }

  equals(other: Ordered<T>): boolean {
    if (this.size() !== other.size()) {
      return false;
    }

    for (let i = 0; i < this.size(); i++) {
      if (this.getAt(i) !== other.getAt(i)) {
        return false;
      }
    }

    return true;
  }

  everyItem(check: (item: T) => boolean): boolean {
    for (const item of this) {
      if (!check(item)) {
        return false;
      }
    }
    return true;
  }

  filterByType<T2>(checker: Type<T2>): OrderedSet<T2> {
    const newItems: T2[] = [];
    for (const item of this) {
      if (checker.check(item)) {
        newItems.push(item);
      }
    }
    return OrderedSet.of(newItems);
  }

  filterItem(checker: (item: T) => boolean): OrderedSet<T> {
    return new OrderedSet(this.data_.slice(0).filter((item: T) => {
      return checker(item);
    }));
  }

  find(check: (item: T) => boolean): T | null {
    for (const item of this.data_) {
      if (check(item)) {
        return item;
      }
    }
    return null;
  }

  getAt(index: number): T | undefined {
    return this.data_[index];
  }

  has(item: T): boolean {
    return this.set_.has(item);
  }

  insertAllAt(index: number, items: FiniteCollection<T>): OrderedSet<T> {
    // Go through the items to add, and count the number of existing items that come before the
    // insertion index.
    let preInsertionCount = 0;
    for (const item of items) {
      const existingIndex = this.data_.indexOf(item);
      if (existingIndex >= 0 && existingIndex < index) {
        preInsertionCount++;
      }
    }

    const clone = [...this.deleteAll(items)];
    clone.splice(index - preInsertionCount, 0, ...items);
    return new OrderedSet<T>(clone);
  }

  insertAt(index: number, item: T): OrderedSet<T> {
    return this.insertAllAt(index, ImmutableSet.of([item]));
  }

  mapItem<R>(fn: (item: T) => R): OrderedSet<R> {
    return new OrderedSet(this.data_.slice(0).map((item: T) => {
      return fn(item);
    }));
  }

  max(ordering: Ordering<T>): T | null {
    return this.reduceItem(
        (prevValue: T | null, value: T) => {
          if (prevValue === null) {
            return value;
          }

          if (ordering(prevValue, value) === -1) {
            return value;
          } else {
            return prevValue;
          }
        },
        null);
  }

  min(ordering: Ordering<T>): T | null {
    return this.max(Orderings.reverse(ordering));
  }

  reduceItem<R>(fn: (prevItem: R, item: T) => R, init: R): R {
    return this.data_.reduce((prev: R, curr: T) => {
      return fn(prev, curr);
    }, init);
  }

  reverse(): OrderedSet<T> {
    return new OrderedSet(this.data_.reverse());
  }

  setAt(index: number, item: T): OrderedSet<T> {
    return this.deleteAt(index).insertAt(index, item);
  }

  size(): number {
    return this.data_.length;
  }

  someItem(check: (item: T) => boolean): boolean {
    for (const item of this) {
      if (check(item)) {
        return true;
      }
    }
    return false;
  }

  sort(compareFn: (item1: T, item2: T) => CompareResult): OrderedSet<T> {
    const clone = this.data_.slice(0);
    clone.sort(compareFn);
    return new OrderedSet<T>(clone);
  }

  static of<T>(items: T[]): OrderedSet<T> {
    const uniques: T[] = [];
    const set = new Set();
    for (const item of items) {
      if (!set.has(item)) {
        set.add(item);
        uniques.push(item);
      }
    }
    return new OrderedSet(uniques);
  }
}

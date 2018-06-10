import { AnyType, InstanceofType, IterableOfType, Type } from 'gs-types/export';
import { Iterables } from '../immutable/iterables';
import { OrderedSet } from '../immutable/ordered-set';
import { Orderings } from '../immutable/orderings';
import { FiniteCollection } from '../interfaces/finite-collection';
import { Ordering } from '../interfaces/ordering';
import { assertUnreachable } from '../typescript/assert-unreachable';

export class ImmutableSet<T> implements FiniteCollection<T> {
  private readonly data_: Set<T>;

  constructor(data: Set<T>) {
    this.data_ = new Set(Iterables.clone(data));
  }

  [Symbol.iterator](): Iterator<T> {
    return this.data_[Symbol.iterator]();
  }

  add(item: T): ImmutableSet<T> {
    const clone = new Set(Iterables.clone(this.data_));
    clone.add(item);
    return new ImmutableSet(clone);
  }

  addAll(items: FiniteCollection<T>): ImmutableSet<T> {
    const clone = new Set(Iterables.clone(this.data_));
    for (const item of items) {
      clone.add(item);
    }
    return new ImmutableSet(clone);
  }

  delete(item: T): ImmutableSet<T> {
    const clone = new Set(Iterables.clone(this.data_));
    clone.delete(item);
    return new ImmutableSet(clone);
  }

  deleteAll(items: FiniteCollection<T>): ImmutableSet<T> {
    const clone = new Set(Iterables.clone(this.data_));
    for (const item of items) {
      clone.delete(item);
    }
    return new ImmutableSet(clone);
  }

  everyItem(check: (item: T) => boolean): boolean {
    for (const item of this) {
      if (!check(item)) {
        return false;
      }
    }
    return true;
  }

  filterByType<T2>(checker: Type<T2>): ImmutableSet<T2> {
    const newItems: T2[] = [];
    for (const item of this) {
      if (checker.check(item)) {
        newItems.push(item);
      }
    }
    return ImmutableSet.of(newItems);
  }

  filterItem(checker: (item: T) => boolean): ImmutableSet<T> {
    const iterable = this;
    return new ImmutableSet(new Set(Iterables.of(function*(): IterableIterator<T> {
      for (const item of iterable) {
        if (checker(item)) {
          yield item;
        }
      }
    })));
  }

  find(check: (item: T) => boolean): T | null {
    for (const item of this.data_) {
      if (check(item)) {
        return item;
      }
    }
    return null;
  }

  has(item: T): boolean {
    return this.data_.has(item);
  }

  mapItem<R>(fn: (item: T) => R): ImmutableSet<R> {
    const iterable = this;
    return new ImmutableSet(new Set(Iterables.of(function*(): IterableIterator<R> {
      for (const item of iterable) {
        yield fn(item);
      }
    })));
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
    let result = init;
    for (const item of this.data_) {
      result = fn(result, item);
    }
    return result;
  }

  size(): number {
    return this.data_.size;
  }

  someItem(check: (item: T) => boolean): boolean {
    for (const item of this) {
      if (check(item)) {
        return true;
      }
    }
    return false;
  }

  sort(compareFn: Ordering<T>): OrderedSet<T> {
    const arrayData = Array.from(this.data_);
    return OrderedSet.of(arrayData.sort(compareFn));
  }

  static of<T>(): ImmutableSet<T>;
  static of<T>(data: Iterable<T>): ImmutableSet<T>;
  static of<T>(data: FiniteCollection<T>): ImmutableSet<T>;
  static of<T>(data: Set<T>): ImmutableSet<T>;
  static of<T>(data: T[]): ImmutableSet<T>;
  static of<T>(data: Set<T> | T[] | FiniteCollection<T> | Iterable<T> = []): ImmutableSet<T> {
    if (InstanceofType<Set<T>>(Set).check(data)) {
      return new ImmutableSet(data);
    } else if (InstanceofType<T[]>(Array).check(data)) {
      return new ImmutableSet(new Set(data));
    } else if (IterableOfType(AnyType()).check(data)) {
      return new ImmutableSet(new Set(data));
    } else {
      throw assertUnreachable(data);
    }
  }
}

import { FiniteIterableType } from '../check/finite-iterable-type';
import { InstanceofType } from '../check/instanceof-type';
import { Iterables } from '../immutable/iterables';
import { Collection } from '../interfaces/collection';
import { Finite } from '../interfaces/finite';
import { assertUnreachable } from '../typescript/assert-unreachable';

export class ImmutableSet<T> implements Collection<T>, Finite<T>, Iterable<T> {
  private readonly data_: Set<T>;

  private constructor(data: Set<T>) {
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

  addAll(items: Iterable<T> & Finite<T>): ImmutableSet<T> {
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

  deleteAll(items: Iterable<T> & Finite<T>): ImmutableSet<T> {
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

  filterItem(checker: (item: T) => boolean): ImmutableSet<T> {
    const iterable = this;
    return new ImmutableSet(new Set(Iterables.of(function* (): IterableIterator<T> {
      for (const item of iterable) {
        if (checker(item)) {
          yield item;
        }
      }
    })));
  }

  has(item: T): boolean {
    return this.data_.has(item);
  }

  mapItem<R>(fn: (item: T) => R): ImmutableSet<R> {
    const iterable = this;
    return new ImmutableSet(new Set(Iterables.of(function* (): IterableIterator<R> {
      for (const item of iterable) {
        yield fn(item);
      }
    })));
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

  static of<T>(data: Iterable<T> & Finite<T>): ImmutableSet<T>;
  static of<T>(data: Set<T>): ImmutableSet<T>;
  static of<T>(data: T[]): ImmutableSet<T>;
  static of<T>(data: Set<T> | T[] | (Iterable<T> & Finite<T>)): ImmutableSet<T> {
    if (InstanceofType<Set<T>>(Set).check(data)) {
      return new ImmutableSet(data);
    } else if (InstanceofType<T[]>(Array).check(data)) {
      return new ImmutableSet(new Set(data));
    } else if (FiniteIterableType.check(data)) {
      return new ImmutableSet(new Set(data));
    } else {
      throw assertUnreachable(data);
    }
  }
}

import { FiniteIterableType } from '../check/finite-iterable-type';
import { HasPropertyType } from '../check/has-property-type';
import { IType } from '../check/i-type';
import { InstanceofType } from '../check/instanceof-type';
import { IntersectType } from '../check/intersect-type';
import { NumberType } from '../check/number-type';
import { Iterables } from '../immutable/iterables';
import { CompareResult } from '../interfaces/compare-result';
import { FiniteCollection } from '../interfaces/finite-collection';
import { FiniteIndexed } from '../interfaces/finite-indexed';
import { Ordered } from '../interfaces/ordered';
import { assertUnreachable } from '../typescript/assert-unreachable';

type ItemList<T> = {item: (index: number) => T, length: number};
function ItemListType<T>(): IType<ItemList<T>> {
  return IntersectType.builder<ItemList<T>>()
      .addType(HasPropertyType('item', InstanceofType(Function)))
      .addType(HasPropertyType('length', NumberType))
      .build();
}

export class ImmutableList<T> implements
    FiniteCollection<T>,
    FiniteIndexed<number, T>,
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

  addAll(items: FiniteCollection<T>): ImmutableList<T> {
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

  deleteAll(items: FiniteCollection<T>): ImmutableList<T> {
    const clone = this.data_.slice(0);
    for (const item of items) {
      const index = clone.indexOf(item);
      if (index >= 0) {
        clone.splice(index, 1);
      }
    }
    return new ImmutableList(clone);
  }

  deleteAllKeys(keys: FiniteCollection<number>): ImmutableList<T> {
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

  every(check: (value: T, key: number) => boolean): boolean {
    for (const [key, value] of this.entries()) {
      if (!check(value, key)) {
        return false;
      }
    }
    return true;
  }

  everyItem(check: (item: T) => boolean): boolean {
    return this.every((value: T) => {
      return check(value);
    });
  }

  filter(checker: (value: T, index: number) => boolean): ImmutableList<T> {
    return new ImmutableList(this.data_.filter(checker));
  }

  filterItem(checker: (item: T) => boolean): ImmutableList<T> {
    return this.filter((value: T, _: number) => checker(value));
  }

  find(check: (item: T) => boolean): T | null {
    return this.findValue(check);
  }

  findEntry(checker: (value: T, index: number) => boolean): [number, T] | null {
    for (const [index, value] of this.entries()) {
      if (checker(value, index)) {
        return [index, value];
      }
    }
    return null;
  }

  findKey(checker: (value: T, index: number) => boolean): number | null {
    const entry = this.findEntry(checker);
    return entry === null ? null : entry[0];
  }

  findValue(checker: (value: T, index: number) => boolean): T | null {
    const entry = this.findEntry(checker);
    return entry === null ? null : entry[1];
  }

  get(index: number): T | undefined {
    return this.data_[index];
  }

  getAt(index: number): T | undefined {
    return this.get(index);
  }

  has(item: T): boolean {
    return this.data_.indexOf(item) >= 0;
  }

  hasKey(key: number): boolean {
    return this.data_[key] !== undefined;
  }

  insertAllAt(index: number, items: FiniteCollection<T>): ImmutableList<T> {
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
    return new ImmutableList(this.data_.map((_: T, index: number) => index));
  }

  map<R>(fn: (value: T, index: number) => R): ImmutableList<R> {
    return new ImmutableList(this.data_.map(fn));
  }

  mapItem<R>(fn: (item: T) => R): ImmutableList<R> {
    return this.map<R>((value: T, _: number) => fn(value));
  }

  reduce<R>(fn: (prevValue: R, value: T, key: number) => R, init: R): R {
    return this.data_.reduce(fn, init);
  }

  reduceItem<R>(fn: (prevItem: R, item: T) => R, init: R): R {
    return this.reduce((prev: R, value: T) => {
      return fn(prev, value);
    }, init);
  }

  reverse(): ImmutableList<T> {
    return new ImmutableList(this.data_.reverse());
  }

  set(index: number, item: T): ImmutableList<T> {
    const clone = this.data_.slice(0);
    clone[index] = item;
    return new ImmutableList(clone);
  }

  setAt(index: number, item: T): ImmutableList<T> {
    return this.set(index, item);
  }

  size(): number {
    return this.data_.length;
  }

  some(check: (value: T, key: number) => boolean): boolean {
    for (const [key, value] of this.entries()) {
      if (check(value, key)) {
        return true;
      }
    }
    return false;
  }

  someItem(check: (item: T) => boolean): boolean {
    return this.some((value: T) => {
      return check(value);
    });
  }

  sort(compareFn: (item1: T, item2: T) => CompareResult): ImmutableList<T> {
    const clone = this.data_.slice(0);
    return new ImmutableList(clone.sort(compareFn));
  }

  toArray(): T[] {
    return this.data_.slice(0);
  }

  values(): ImmutableList<T> {
    return this;
  }

  static of<T>(data: FiniteCollection<T>): ImmutableList<T>;
  static of<T>(data: T[]): ImmutableList<T>;
  static of<T>(data: ItemList<T>): ImmutableList<T>;
  static of<T>(data: T[] | FiniteCollection<T> | ItemList<T>): ImmutableList<T> {
    if (FiniteIterableType.check(data)) {
      return new ImmutableList<T>(Iterables.toArray(data));
    } else if (ItemListType<T>().check(data)) {
      const array: T[] = [];
      for (let i = 0; i < data.length; i++) {
        array.push(data.item(i));
      }
      return new ImmutableList(array);
    } else if (data instanceof Array) {
      return new ImmutableList<T>(data);
    } else {
      throw assertUnreachable(data);
    }
  }
}

import {
  FiniteIterableType,
  HasPropertyType,
  InstanceofType,
  IntersectType,
  NumberType,
  Type } from '../check';
import { Errors } from '../error';
import { Orderings } from '../immutable/orderings';
import { CompareResult, FiniteCollection, FiniteIndexed, Ordered, Ordering } from '../interfaces';
import { assertUnreachable } from '../typescript';

type ItemList<T> = { item: (index: number) => T, length: number };
function ItemListType<T>(): Type<ItemList<T>> {
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

  constructor(data: T[]) {
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

  filterByType<T2>(checker: Type<T2>): ImmutableList<T2> {
    const newItems: T2[] = [];
    for (const item of this) {
      if (checker.check(item)) {
        newItems.push(item);
      }
    }
    return ImmutableList.of(newItems);
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
    const normalizedIndex = index < 0 ? index + this.size() : index;
    return this.get(normalizedIndex);
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

  slice(start?: number, end?: number, step: number = 1): ImmutableList<T> {
    if (step === 0) {
      throw Errors.assert('step').shouldBe('not 0').butWas(step);
    }

    let normalizedEnd;
    if (end === undefined) {
      normalizedEnd = step > 0 ? this.data_.length : -1;
    } else if (end < 0) {
      normalizedEnd = end + this.data_.length;
    } else {
      normalizedEnd = end;
    }

    let normalizedStart;
    if (start !== undefined) {
      normalizedStart = start;
    } else if (step > 0) {
      normalizedStart = 0;
    } else {
      normalizedStart = this.data_.length - 1;
    }

    const sliceData: T[] = [];
    let loopBound;
    if (step > 0) {
      loopBound = Math.min(this.data_.length, normalizedEnd);
    } else {
      loopBound = Math.max(-1, normalizedEnd);
    }
    for (let i = normalizedStart; step < 0 ? i > loopBound : i < loopBound; i += step) {
      sliceData.push(this.data_[i]);
    }
    return new ImmutableList(sliceData);
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

  toString(): string {
    const items = this.mapItem((item: T) => `${item}`);
    return `[${[...items].join(', ')}]`;
  }

  values(): ImmutableList<T> {
    return this;
  }

  static of<T>(data: FiniteCollection<T>): ImmutableList<T>;
  static of<T>(data: T[]): ImmutableList<T>;
  static of<DataTransferItem>(data: DataTransferItemList): ImmutableList<DataTransferItem>;
  static of<T>(data: ItemList<T>): ImmutableList<T>;
  static of(
      data: any[] |
          FiniteCollection<any> |
          ItemList<any> |
          DataTransferItemList): ImmutableList<any> {
    if (FiniteIterableType.check(data)) {
      return new ImmutableList<any>([...data]);
    } else if (ItemListType<any>().check(data)) {
      const array: any[] = [];
      for (let i = 0; i < data.length; i++) {
        array.push(data.item(i));
      }
      return new ImmutableList(array);
    } else if (data instanceof DataTransferItemList) {
      const array: DataTransferItem[] = [];
      for (let i = 0; i < data.length; i++) {
        array.push(data[i]);
      }
      return new ImmutableList<DataTransferItem>(array);
    } else if (data instanceof Array) {
      return new ImmutableList<any>(data);
    } else {
      throw assertUnreachable(data);
    }
  }
}

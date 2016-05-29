import {ArrayIterable} from './array-iterable';
import {BaseFluent} from './base-fluent';
import {FluentIterable, Iterables} from './iterables';
import {IFluentIndexable} from './interfaces';
import {Indexable} from './indexable';


export class FluentIndexable<T> extends BaseFluent<T[]> implements IFluentIndexable<T> {
  constructor(data: T[]) {
    super(data);
  }

  addAll(other: Iterable<T>): FluentIterable<T> {
    return Iterables.of(ArrayIterable.newInstance(this.data))
        .addAll(other);
  }

  addAllArray(array: T[]): FluentIndexable<T> {
    array.forEach((element: T) => {
      this.data.push(element);
    });
    return this;
  }

  asArray(): Array<T> {
    return this.data;
  }

  asIterable(): Iterable<T> {
    return ArrayIterable.newInstance(this.data);
  }

  asIterator(): Iterator<T> {
    return this.asIterable()[Symbol.iterator]();
  }

  filter(fn: (value: T) => boolean): FluentIndexable<T> {
    return this.filterElement((value: T) => {
      return fn(value);
    });
  }

  filterElement(fn: (value: T, index: number) => boolean): FluentIndexable<T> {
    let newArray = [];
    this.forEach((value: T, index: number) => {
      if (fn(value, index)) {
        newArray.push(value);
      }
    });
    return new FluentIndexable<T>(newArray);
  }

  find(fn: (value: T, index: number) => boolean): T {
    let index = this.findIndex(fn);
    return index !== null ? this.data[index] : null;
  }

  findIndex(fn: (value: T, index: number) => boolean): number {
    for (let i = 0; i < this.data.length; i++) {
      if (fn(this.data[i], i)) {
        return i;
      }
    }
    return null;
  }

  forEach(fn: (value: T, index: number) => void): FluentIndexable<T> {
    return this.forOf((value: T, index: number) => {
      fn(value, index);
    });
  }

  forOf(fn: (value: T, index: number, breakFn: () => void) => void): FluentIndexable<T> {
    let shouldBreak = false;
    for (let i = 0; i < this.data.length && !shouldBreak; i++) {
      fn(this.data[i], i, () => {
        shouldBreak = true;
      });
    }
    return this;
  }

  iterate(fn: (value: T, breakFn: () => void) => void): FluentIndexable<T> {
    Iterables.of(this.asIterable()).iterate(fn);
    return this;
  }

  map<T2>(fn: (value: T) => T2): FluentIndexable<T2> {
    return this.mapElement((value: T) => {
      return fn(value);
    });
  }

  mapElement<T2>(fn: (value: T, index: number) => T2): FluentIndexable<T2> {
    let newArray = [];
    this.forEach((value: T, index: number) => {
      newArray.push(fn(value, index));
    });
    return Indexables.of(newArray);
  }

  removeAll(toRemove: Set<T>): IFluentIndexable<T> {
    let newArray = [];
    this.forEach((value: T) => {
      if (!toRemove.has(value)) {
        newArray.push(value);
      }
    });
    return new FluentIndexable<T>(newArray);
  }
}

export class Indexables {
  static of<T>(data: T[]): FluentIndexable<T> {
    return new FluentIndexable<T>(data);
  }
}

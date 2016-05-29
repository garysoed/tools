import {BaseFluent} from './base-fluent';
import {FluentIterable, Iterables} from './iterables';
import {IFluentNonIndexable} from './interfaces';
import {ArrayIterable} from './array-iterable';


export class FluentNonIndexable<T> extends BaseFluent<T[]> implements IFluentNonIndexable<T> {
  constructor(data: T[]) {
    super(data);
  }

  addAll(other: Iterable<T>): FluentIterable<T> {
    return Iterables.of(this.asIterable()).addAll(other);
  }

  addAllArray(array: T[]): FluentNonIndexable<T> {
    array.forEach((value: T) => {
      this.data.push(value);
    });

    return this;
  }

  asArray(): T[] {
    return this.data;
  }

  asIterable(): Iterable<T> {
    return new ArrayIterable(this.data);
  }

  asIterator(): Iterator<T> {
    return this.asIterable()[Symbol.iterator]();
  }

  asSet(): Set<T> {
    return new Set(this.data);
  }

  filter(filterFn: (value: T) => boolean): FluentNonIndexable<T> {
    let filteredData = [];
    this.forEach((value: T) => {
      if (filterFn(value)) {
        filteredData.push(value);
      }
    });
    return new FluentNonIndexable<T>(filteredData);
  }

  find(fn: (value: T) => boolean): T {
    for (let i = 0; i < this.data.length; i++) {
      if (fn(this.data[i])) {
        return this.data[i];
      }
    }

    return null;
  }

  forEach(fn: (value: T) => void): FluentNonIndexable<T> {
    this.data.forEach((value: T) => {
      fn(value);
    });
    return this;
  }

  forOf(fn: (value: T, breakFn: () => void) => void): FluentNonIndexable<T> {
    return this.iterate(fn);
  }

  iterate(fn: (value: T, breakFn: () => void) => void): FluentNonIndexable<T> {
    Iterables.of(ArrayIterable.newInstance(this.data))
        .iterate(fn);
    return this;
  }

  map<T2>(fn: (value: T) => T2): FluentNonIndexable<T2> {
    let newArray = [];
    this.forEach((value: T) => {
      newArray.push(fn(value));
    });
    return new FluentNonIndexable<T2>(newArray);
  }

  removeAll(toRemove: Set<T>): FluentNonIndexable<T> {
    let newData = [];
    this.forEach((value: T) => {
      if (!toRemove.has(value)) {
        newData.push(value);
      }
    });
    return new FluentNonIndexable<T>(newData);
  }
}

export class NonIndexables {
  static of<T>(data: T[]): FluentNonIndexable<T> {
    return new FluentNonIndexable<T>(data);
  }

  static fromIterable<T>(iterable: Iterable<T>): FluentNonIndexable<T> {
    let data = [];
    Iterables.of(iterable)
        .iterate((value: T) => {
          data.push(value);
        });

    return new FluentNonIndexable<T>(data);
  }
}

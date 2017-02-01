import {Validate} from '../valid/validate';

import {ArrayIterable} from './array-iterable';
import {BaseFluent} from './base-fluent';
import {IFluentIndexable} from './interfaces';
import {FluentIterable, Iterables} from './iterables';


export class FluentIndexable<T> extends BaseFluent<T[]> implements IFluentIndexable<T> {
  /**
   * @param data The underlying data.
   */
  constructor(data: T[]) {
    super(data);
  }

  /**
   * @override
   */
  addAll(other: Iterable<T>): FluentIterable<T> {
    return Iterables.of(ArrayIterable.newInstance(this.getData()))
        .addAll(other);
  }

  addAllArray(array: T[]): FluentIndexable<T> {
    array.forEach((element: T) => {
      this.getData().push(element);
    });
    return this;
  }

  asArray(): Array<T> {
    return this.getData();
  }

  asIterable(): Iterable<T> {
    return ArrayIterable.newInstance(this.getData());
  }

  asIterator(): Iterator<T> {
    return this.asIterable()[Symbol.iterator]();
  }

  castElements<T2 extends T>(): FluentIndexable<T2> {
    return <FluentIndexable<T2>> <any> this;
  }

  equalsTo(other: T[]): boolean {
    if (this.getData().length !== other.length) {
      return false;
    }

    return this.every((value: T, index: number) => {
      return value === other[index];
    });
  }

  every(fn: (value: T, index: number) => boolean): boolean {
    return this.getData().every((value: T, index: number) => {
      return fn(value, index);
    });
  }

  filter(fn: (value: T) => boolean): FluentIndexable<T> {
    return this.filterElement((value: T) => {
      return fn(value);
    });
  }

  filterElement(fn: (value: T, index: number) => boolean): FluentIndexable<T> {
    let newArray: T[] = [];
    this.forEach((value: T, index: number) => {
      if (fn(value, index)) {
        newArray.push(value);
      }
    });
    return new FluentIndexable<T>(newArray);
  }

  find(fn: (value: T, index: number) => boolean): (T|null) {
    let index = this.findIndex(fn);
    return index !== null ? this.getData()[index] : null;
  }

  findIndex(fn: (value: T, index: number) => boolean): (number|null) {
    for (let i = 0; i < this.getData().length; i++) {
      if (fn(this.getData()[i], i)) {
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
    for (let i = 0; i < this.getData().length && !shouldBreak; i++) {
      fn(this.getData()[i], i, () => {
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
    let newArray: T2[] = [];
    this.forEach((value: T, index: number) => {
      newArray.push(fn(value, index));
    });
    return Indexables.of(newArray);
  }

  removeAll(toRemove: Set<T>): IFluentIndexable<T> {
    let newArray: T[] = [];
    this.forEach((value: T) => {
      if (!toRemove.has(value)) {
        newArray.push(value);
      }
    });
    return new FluentIndexable<T>(newArray);
  }

  reverse(): IFluentIndexable<T> {
    return Indexables.of(this.getData().reverse());
  }

  zip<T2>(other: T2[]): IFluentIndexable<[T, T2]> {
    let thisData = this.getData();
    Validate.any(other.length).to.beEqualTo(thisData.length)
        .orThrows(`Other array has a length of ${other.length}, expected ${thisData.length}`);

    return this
        .mapElement((value: T, index: number) => {
          return <[T, T2]> [value, other[index]];
        });
  }
}

export class Indexables {
  static of<T>(data: T[]): FluentIndexable<T> {
    return new FluentIndexable<T>(data);
  }
}

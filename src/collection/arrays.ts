import BaseFluent from './base-fluent';
import Iterables from './iterables';
import Records from './records';
import Sets from './sets';

export class FluentArrays<T> extends BaseFluent<T[]> {
  constructor(data: T[]) {
    super(data);
  }

  diff(toRemove: T[]): FluentArrays<T> {
    let toRemoveSet = Sets.fromArray(toRemove).data;
    let result = [];

    this.forOf((value: T) => {
      if (!toRemoveSet.has(value)) {
        result.push(value);
      }
    });

    return new FluentArrays(result);
  }

  forOf(fn: (value: T, breakFn: () => void) => void): FluentArrays<T> {
    Iterables.of<T>(this.data).forOf(fn);
    return this;
  }
}

const Arrays = {
  fromIterable<T>(iterable: Iterable<T>): FluentArrays<T> {
    let array = [];
    Iterables.of(iterable).forOf((value: T) => {
      array.push(value);
    });
    return Arrays.of(array);
  },

  fromNumericalIndexed<T>(data: {[index: number]: T, length: number}): FluentArrays<T> {
    let array = [];
    for (let i = 0; i < data.length; i++) {
      array.push(data[i]);
    }
    return Arrays.of(array);
  },

  fromRecordKeys(record: {[key: string]: any}): FluentArrays<string> {
    let array = [];
    Records
        .of(record)
        .forEach((value: any, key: string) => {
          array.push(key);
        });
    return Arrays.of(array);
  },

  fromRecordValues<T>(record: {[key: string]: T}): FluentArrays<T> {
    let array = [];
    Records
        .of(record)
        .forEach((value: T, key: string) => {
          array.push(value);
        });
    return Arrays.of(array);
  },

  of<T>(data: T[]): FluentArrays<T> {
    return new FluentArrays<T>(data);
  },
};

export default Arrays;

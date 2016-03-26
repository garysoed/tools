/**
 * @fileoverview Provides utilities to manipulate records. These are JSON objects with string keys
 * and values of the same type.
 */
import BaseFluent from './base-fluent';


interface IRecord<T> {
  [key: string]: T;
}

export class FluentRecords<T> extends BaseFluent<IRecord<T>> {

  constructor(data: IRecord<T>) {
    super(data);
  }

  filter(fn: (value: T, key: string) => boolean): FluentRecords<T> {
    let newRecord: IRecord<T> = {};
    this.forEach((value: T, key: string) => {
      if (fn(value, key)) {
        newRecord[key] = value;
      }
    });

    return new FluentRecords<T>(newRecord);
  }

  forEach(fn: (arg: T, key: string) => void): void {
    for (let key in this.data) {
      fn(this.data[key], key);
    }
  }

  mapValue<V>(fn: (arg: T, key: string) => V): FluentRecords<V> {
    let outData = <IRecord<V>> {};
    for (let key in this.data) {
      outData[key] = fn(this.data[key], key);
    }
    return new FluentRecords<V>(outData);
  }
}

export default {
  of<T>(data: IRecord<T>): FluentRecords<T> {
    return new FluentRecords<T>(data);
  },
};

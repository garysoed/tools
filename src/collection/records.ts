/**
 * @fileoverview Provides utilities to manipulate records. These are JSON objects with string keys
 * and values of the same type.
 */
import BaseFluent from './base-fluent';
import Maps, { FluentMap } from './maps';


interface IRecord<T> {
  [key: string]: T;
}

export class FluentRecords<T> extends BaseFluent<IRecord<T>> {

  constructor(data: IRecord<T>) {
    super(data);
  }

  mapValue<V>(fn: (arg: T) => V): FluentRecords<V> {
    let outData = <IRecord<V>> {};
    for (let key in this.data) {
      outData[key] = fn(this.data[key]);
    }
    return new FluentRecords<V>(outData);
  }

  toMap(): FluentMap<string, T> {
    let entries = [];
    for (let key in this.data) {
      entries.push([key, this.data[key]]);
    }

    return Maps.of(new Map<string, T>(entries));
  }
}

export default {
  of<T>(data: IRecord<T>): FluentRecords<T> {
    return new FluentRecords<T>(data);
  },
};

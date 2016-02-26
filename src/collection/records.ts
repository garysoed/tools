/**
 * @fileoverview Provides utilities to manipulate records. These are JSON objects with string keys
 * and values of the same type.
 */

interface IRecord<T> {
  [key: string]: T;
}

class FluentRecords<T> {
  private data_: IRecord<T>;

  constructor(data: IRecord<T>) {
    this.data_ = data;
  }

  get data(): IRecord<T> {
    return this.data_;
  }

  mapValue<V>(fn: (arg: T) => V): FluentRecords<V> {
    let outData = <IRecord<V>> {};
    for (let key in this.data) {
      outData[key] = fn(this.data[key]);
    }
    return new FluentRecords<V>(outData);
  }
}

export default {
  of<T>(data: IRecord<T>): FluentRecords<T> {
    return new FluentRecords<T>(data);
  },
};

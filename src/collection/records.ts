/**
 * @fileoverview Provides utilities to manipulate records. These are JSON objects with string keys
 * and values of the same type.
 */
import BaseFluent from './base-fluent';
import Maps from './maps';

interface IRecord<T> {
  [key: string]: T;
}

export class FluentRecord<T> extends BaseFluent<IRecord<T>> {

  constructor(data: IRecord<T>) {
    super(data);
  }

  /**
   * Adds all values in the given map, overriding the values whenever there is conflict.
   * @param map The map whose values should be added.
   * @return The object with the added values for chaining.
   */
  addAll(map: Map<string, T>): FluentRecord<T> {
    Maps.of(map)
        .forEach((value: T, key: string) => {
          this.data[key] = value;
        });
    return this;
  }

  filter(fn: (value: T, key: string) => boolean): FluentRecord<T> {
    let newRecord: IRecord<T> = {};
    this.forEach((value: T, key: string) => {
      if (fn(value, key)) {
        newRecord[key] = value;
      }
    });

    return new FluentRecord<T>(newRecord);
  }

  forEach(fn: (arg: T, key: string) => void): void {
    for (let key in this.data) {
      fn(this.data[key], key);
    }
  }

  mapValue<V>(fn: (arg: T, key: string) => V): FluentRecord<V> {
    let outData = <IRecord<V>> {};
    for (let key in this.data) {
      outData[key] = fn(this.data[key], key);
    }
    return new FluentRecord<V>(outData);
  }
}

export default {
  of<T>(data: IRecord<T>): FluentRecord<T> {
    return new FluentRecord<T>(data);
  },
};

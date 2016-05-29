import {Indexable} from './indexable';
import {Iterables} from './iterables';
import {FluentMappable, Mappables} from './mappables';


/**
 * Collection of methods to help manipulate maps.
 *
 * The general flow is to input a map, do a bunch of transformations, and output the transformed
 * map at the end. Note that the input map should never be used again. This class does not make any
 * guarantee that it will / will not modify the input map.
 *
 * Example:
 *
 * ```typescript
 * let map = new Map<number, number>([[1, 2], [3, 4]]);
 * Maps
 *     .of(map)
 *     .forEach((value: number, key: number) => {
 *       console.log(value + key);
 *     });
 * ```
 *
 * Note that every key and value in the map must be of the same type.
 */
export class Maps {
  /**
   * Starts by using an array by using the indexes as the key.
   *
   * `undefined` entries will be skipped.
   *
   * @param array Array whose elements should be used as the map's values.
   */
  static fromArray<V>(array: V[]): FluentMappable<number, V> {
    let entries = [];
    for (let i = 0; i < array.length; i++) {
      let element = array[i];
      if (element !== undefined) {
        entries.push([i, element]);
      }
    }

    return Maps.of<number, V>(new Map<number, V>(entries));
  }

  /**
   * Starts by using any `Object`s with numerical indexes.
   *
   * @param <V> Type of the map values.
   * @param struct `Object` with numerical indexes.
   * @return Map wrapper object to do operations on.
   */
  static fromNumericalIndexed<V>(struct: { [index: number]: V }): FluentMappable<number, V> {
    let entries = [];
    for (let key in struct) {
      entries.push([Number(key), struct[key]]);
    }

    return Maps.of<number, V>(new Map<number, V>(entries));
  }

  /**
   * Starts by using any `Record` objects.
   *
   * @param <K> Type of the map's key.
   * @param <V> Type of the map's value.
   * @param record Record object to start from.
   * @return Map wrapper object to do operations on.
   */
  static fromRecord<V>(record: { [key: string]: V }): FluentMappable<string, V> {
    let entries = [];
    for (let key in record) {
      entries.push([key, record[key]]);
    }

    return Maps.of<string, V>(new Map<string, V>(entries));
  }

  /**
   * Starts by using a map.
   *
   * @param <K> Type of the map's key.
   * @param <V> Type of the map's value.
   * @param data The map object to start with.
   * @return Map wrapper object to do operations on.
   */
  static of<K, V>(data: Map<K, V>): FluentMappable<K, V> {
    return Mappables.of<K, V>(data);
  }
};

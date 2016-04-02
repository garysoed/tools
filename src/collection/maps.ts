/// @doc
import BaseFluent from './base-fluent';

/**
 * Chainable object to manipulate a map.
 *
 * @param <K> Type of the map's key.
 * @param <V> Type of the map's value.
 */
export class FluentMap<K, V> extends BaseFluent<Map<K, V>> {
  /**
   * @param data The underlying map object to modify.
   */
  constructor(data: Map<K, V>) {
    super(data);
  }

  /**
   * Calls the given function for every entry in the map.
   *
   * @param fn The function to call. This accepts two arguments:
   *
   * 1.  Value of the entry.
   * 1.  Key of the entry.
   * @return [[FluentMap]] object for chaining.
   */
  forEach(fn: (value: V, key: K) => any): FluentMap<K, V> {
    this.data.forEach((value: V, key: K) => {
      fn(value, key);
    });
    return this;
  }
}

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
const Maps = {
  /**
   * Starts by using a map.
   *
   * @param <K> Type of the map's key.
   * @param <V> Type of the map's value.
   * @param data The map object to start with.
   * @return Map wrapper object to do operations on.
   */
  of<K, V>(data: Map<K, V>): FluentMap<K, V> {
    return new FluentMap<K, V>(data);
  },

  /**
   * Starts by using any `Record` objects.
   *
   * @param <K> Type of the map's key.
   * @param <V> Type of the map's value.
   * @param record Record object to start from.
   * @return Map wrapper object to do operations on.
   */
  fromRecord<V>(record: { [key: string]: V }): FluentMap<string, V> {
    let entries = [];
    for (let key in record) {
      entries.push([key, record[key]]);
    }

    return Maps.of<string, V>(new Map<string, V>(entries));
  },
};

export default Maps;

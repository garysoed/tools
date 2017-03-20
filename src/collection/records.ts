import { FluentMappable, Mappables } from './mappables';


type Record = {[key: string]: any};

/**
 * Collection of methods to help manipulate records.
 *
 * Records are objects with string indexes. This class supports records whose values are of the same
 * type.
 *
 * The general flow is to input a record, do a bunch of transformations, and output the transformed
 * record at the end. Note that the input record should never be used again. This class does not
 * make any guarantee that it will / will not modify the input record.
 *
 * Example:
 *
 * ```typescript
 * Records
 *     .of({'a': 1, 'b': 2})
 *     .mapValue((value: number) => {
 *       return value + 1;
 *     })
 *     .data;  // {'a': 2, 'b':3}
 * ```
 *
 * Note that every value in the record must be of the same type.
 */
export class Records {
  /**
   * Starts by using a record.
   *
   * @param <T> Type of the record's value.
   * @param data The record object to start with.
   * @return Record wrapper object to do operations on.
   */
  static of(data: Record): FluentMappable<string, any> {
    let map = new Map<string, any>();
    for (let key in data) {
      map.set(key, data[key]);
    }
    return Mappables.of(map);
  }

  /**
   * Starts by using an array of keys.
   *
   * @param <T> The type of the record values.
   * @param keys The keys to start with.
   * @param fn Function to generate the value from the given keys.
   * @return Record wrapper object to do operations on.
   */
  static fromKeys(keys: string[], fn: (key: string) => any): FluentMappable<string, any> {
    let map = new Map<string, any>();
    keys.forEach((key: string) => {
      map.set(key, fn(key));
    });
    return Mappables.of(map);
  }
};

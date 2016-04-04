/// @doc
import BaseFluent from './base-fluent';
import Maps from './maps';

/**
 * Represents a record.
 *
 * @param <T> The type of the record value.
 */
interface IRecord<T> {
  [key: string]: T;
}

/**
 * Chainable object to manipulate a record.
 *
 * @param <T> Type of the record's value.
 */
export class FluentRecord<T> extends BaseFluent<IRecord<T>> {

  /**
   * @param data The underlying record object to modify.
   */
  constructor(data: IRecord<T>) {
    super(data);
  }

  /**
   * Adds all values in the given map, overriding the values whenever there is conflict.
   *
   * @param map The map whose values should be added.
   * @return [[FluentRecord]] object for chaining.
   */
  addAll(map: Map<string, T>): FluentRecord<T> {
    Maps.of(map)
        .forEach((value: T, key: string) => {
          this.data[key] = value;
        });
    return this;
  }

  /**
   * Filters entries of the record based on the given filter function.
   *
   * @param fn Function used to filter the record. This function accepts two arguments:
   *
   * 1.  The value of the record entry.
   * 1.  The key of the record entry.
   *
   * And should return true iff the entry should be kept in the record.
   * @return [[FluentRecord]] object for chaining.
   */
  filter(fn: (value: T, key: string) => boolean): FluentRecord<T> {
    let newRecord: IRecord<T> = {};
    this.forEach((value: T, key: string) => {
      if (fn(value, key)) {
        newRecord[key] = value;
      }
    });

    return new FluentRecord<T>(newRecord);
  }

  /**
   * Calls the given function for every entry in the record.
   *
   * @param fn The function to call. This accepts two arguments:
   *
   * 1.  Value of the entry.
   * 1.  Key of the entry.
   * @return [[FluentRecord]] object for chaining.
   */
  forEach(fn: (arg: T, key: string) => void): FluentRecord<T> {
    for (let key in this.data) {
      fn(this.data[key], key);
    }

    return this;
  }

  /**
   * Maps the values of the record using the input function.
   *
   * @param <V> The type of the new value.
   * @param fn The mapping function. This accepts two arguments:
   *
   * 1.  Value of the entry.
   * 1.  Key of the entry.
   *
   * And should return the new value for the entry.
   * @return [[FluentRecord]] object for chaining.
   */
  mapValue<V>(fn: (arg: T, key: string) => V): FluentRecord<V> {
    let outData = <IRecord<V>> {};
    for (let key in this.data) {
      outData[key] = fn(this.data[key], key);
    }
    return new FluentRecord<V>(outData);
  }
}

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
class Records {
  /**
   * Starts by using a record.
   *
   * @param <T> Type of the record's value.
   * @param data The record object to start with.
   * @return Record wrapper object to do operations on.
   */
  static of<T>(data: IRecord<T>): FluentRecord<T> {
    return new FluentRecord<T>(data);
  }
};

export default Records;

import {Operator} from '../../typescript/operator';

/**
 * Converts the {@link Iterable} to a record.
 *
 * @typeParam V - Type of values in the record.
 * @returns `Operator` to convert `Iterable`s to maps.
 * @thModule collect.operators
 */
export function $asRecord<V>(): Operator<Iterable<[string, V]>, Record<string, V>> {
  return iterable => {
    const record: Record<string, V> = {};
    for (const [key, value] of iterable) {
      record[key] = value;
    }
    return record;
  };
}

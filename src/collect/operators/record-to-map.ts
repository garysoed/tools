import {Operator} from '../../typescript/operator';

/**
 * Converts the input record to {@link Map}.
 *
 * @returns `Operator` that converts the given `Record` to a `Map`.
 * @thModule collect.operators
 */
export function $recordToMap(): Operator<
  Record<string, unknown>,
  ReadonlyMap<string, unknown>
> {
  return (record) => {
    const map = new Map<string, unknown>();
    for (const key of Object.keys(record)) {
      map.set(key, record[key]);
    }
    return map;
  };
}

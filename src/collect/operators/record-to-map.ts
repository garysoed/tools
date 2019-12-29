import { Operator } from './operator';

export function recordToMap(): Operator<Record<string, unknown>, Map<string, unknown>> {
  return record => {
    const map = new Map<string, unknown>();
    for (const key of Object.keys(record)) {
      map.set(key, record[key]);
    }
    return map;
  };
}

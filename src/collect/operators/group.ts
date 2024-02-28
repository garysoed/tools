import {Operator} from '../../typescript/operator';

import {FiniteIterable} from './finite-iterable';

export function $group<T, K>(
  indexFn: (item: T) => K,
): Operator<FiniteIterable<T>, ReadonlyMap<K, readonly T[]>> {
  return (source) => {
    const resultMap = new Map<K, T[]>();
    for (const item of source) {
      const key = indexFn(item);
      const collection = resultMap.get(key) ?? [];
      collection.push(item);
      resultMap.set(key, collection);
    }
    return resultMap;
  };
}

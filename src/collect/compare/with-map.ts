import { CompareResult } from './compare-result';
import { Ordering } from './ordering';

export function withMap<T1, T2>(mapFn: (input: T1) => T2, ordering: Ordering<T2>): Ordering<T1> {
  return (item1: T1, item2: T1): CompareResult => {
    return ordering(mapFn(item1), mapFn(item2));
  };
}


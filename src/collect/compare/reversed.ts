import { CompareResult } from './compare-result';
import { Ordering } from './ordering';

export function reversed<T>(ordering: Ordering<T>): Ordering<T> {
  return (item1: T, item2: T): CompareResult => {
    return ordering(item2, item1);
  };
}

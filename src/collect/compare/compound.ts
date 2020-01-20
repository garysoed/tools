import { CompareResult } from './compare-result';
import { Ordering } from './ordering';

export function compound<T>(orderings: ReadonlyArray<Ordering<T>>): Ordering<T> {
  return (item1: T, item2: T): CompareResult => {
    for (const ordering of orderings) {
      const result = ordering(item1, item2);
      if (result !== 0) {
        return result;
      }
    }

    return 0;
  };
}

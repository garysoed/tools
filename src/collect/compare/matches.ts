import { CompareResult } from './compare-result';
import { Ordering } from './ordering';

export function matches<T>(matchFn: (input: T) => boolean): Ordering<T> {
  return (item1: T, item2: T): CompareResult => {
    const matches1 = matchFn(item1);
    const matches2 = matchFn(item2);
    if (matches1 === matches2) {
      return 0;
    }

    return (matches1 && !matches2) ? -1 : 1;
  };
}

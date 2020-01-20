import { CompareResult } from './compare-result';
import { normal } from './normal';
import { Ordering } from './ordering';

export function following<T>(specs: readonly T[]): Ordering<T> {
  const ordering = new Map<T, number>();
  for (let i = 0; i < specs.length; i++) {
    ordering.set(specs[i], i);
  }

  const normalOrdering = normal();

  return (item1, item2): CompareResult => {
    const ordinal1 = ordering.get(item1);
    const ordinal2 = ordering.get(item2);
    if (ordinal1 === undefined) {
      return 0;
    }

    if (ordinal2 === undefined) {
      return 0;
    }

    return normalOrdering(ordinal1, ordinal2);
  };
}

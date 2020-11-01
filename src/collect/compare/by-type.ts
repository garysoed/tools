import { Type } from 'gs-types';

import { CompareResult } from './compare-result';
import { Ordering } from './ordering';
import { normal } from './normal';
import { reversed } from './reversed';

/**
 * Order the items by the types.
 *
 * @param types - Array of types to order the items with.
 * @returns `Ordering` that sorts a collection by types, in the same order as the given types array.
 * @thModule collect.compare
 */
export function byType(types: ReadonlyArray<Type<any>>): Ordering<any> {
  return (item1: any, item2: any): CompareResult => {
    for (const type of types) {
      const passes1 = type.check(item1);
      const passes2 = type.check(item2);
      if (passes1 !== passes2) {
        return reversed(normal())(passes1, passes2);
      }
    }

    return 0;
  };
}

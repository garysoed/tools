import { Type } from 'gs-types';

import { CompareResult } from './compare-result';
import { normal } from './normal';
import { Ordering } from './ordering';
import { reversed } from './reversed';

/**
 * Order the items by the types.
 */
export function byType(types: Iterable<Type<any>>): Ordering<any> {
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

import { Ordering } from '../compare/ordering';

import { Operator } from './operator';

export function sort<T>(ordering: Ordering<T>): Operator<readonly T[], readonly T[]> {
  return array => [...array].sort(ordering);
}

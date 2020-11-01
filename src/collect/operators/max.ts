import { Ordering } from '../compare/ordering';
import { reversed } from '../compare/reversed';

import { $pipe } from './pipe';
import { Operator } from './operator';
import { first } from './first';
import { sort } from './sort';


/**
 * Returns the largest element in the given array.
 *
 * @typeParam T - Type of the element.
 * @param ordering - Ordering function to use
 * @returns The largest element in the given array.
 * @thModule collect.operators
 */
export function max<T>(ordering: Ordering<T>): Operator<readonly T[], T|null> {
  return obj => $pipe(obj, sort(reversed(ordering)), first());
}

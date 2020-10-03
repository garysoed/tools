import { Ordering } from '../compare/ordering';

import { first } from './first';
import { Operator } from './operator';
import { $pipe } from './pipe';
import { sort } from './sort';


/**
 * Returns the smallest element in the given array.
 *
 * @typeParam T - Type of the element.
 * @param ordering - Ordering function to use
 * @returns The smallest element in the given array.
 * @thModule collect.operators
 */
export function min<T>(ordering: Ordering<T>): Operator<readonly T[], T|null> {
  return obj => $pipe(obj, sort(ordering), first());
}

import {Operator} from './operator';

/**
 * Joins the items in the given array together as one string.
 *
 * @param separator - Separator to join the items together.
 * @returns `Operator` that joins all items in the given array as one string using the given
 *     separator.
 * @thModule collect.operators
 */
export function join(separator: string): Operator<readonly string[], string> {
  return input => input.join(separator);
}

import { Operator } from './operator';

export function reverse<T>(): Operator<readonly T[], readonly T[]> {
  return array => [...array].reverse();
}

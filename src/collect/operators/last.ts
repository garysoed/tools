import {Operator} from '../../typescript/operator';

import {FiniteIterable} from './finite-iterable';

export function $last<T>(): Operator<FiniteIterable<T>, null | T>;
export function $last<T>(maxItems: number): Operator<Iterable<T>, null | T>;
export function $last<T>(maxItems?: number): Operator<Iterable<T>, null | T> {
  return (iterable) => {
    let i = 0;
    let last = null;
    for (const item of iterable) {
      if (maxItems !== undefined && i >= maxItems) {
        break;
      }
      last = item;
      i++;
    }

    return last;
  };
}

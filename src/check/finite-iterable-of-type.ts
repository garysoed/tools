import { FiniteIterableType } from '../check/finite-iterable-type';
import { Type } from '../check/type';
import { Finite } from '../interfaces/finite';

export function FiniteIterableOfType<T, I extends Finite & Iterable<T>>(type: Type<T>):
    Type<I> {
  return {
    check(target: any): target is I {
      if (!FiniteIterableType.check(target)) {
        return false;
      }

      for (const item of target) {
        if (!type.check(item)) {
          return false;
        }
      }

      return true;
    },

    toString(): string {
      return `(Finite & Iterable<${type}>)`;
    },
  };
}

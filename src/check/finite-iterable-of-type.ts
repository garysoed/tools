import { FiniteIterableType } from '../check/finite-iterable-type';
import { IType } from '../check/i-type';
import { Finite } from '../interfaces/finite';

export function FiniteIterableOfType<T, I extends Finite & Iterable<T>>(type: IType<T>):
    IType<I> {
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
  };
}

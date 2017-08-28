import { HasPropertiesType } from '../check/has-properties-type';
import { InstanceofType } from '../check/instanceof-type';
import { Type } from '../check/type';

const IterableType = HasPropertiesType<Iterable<any>>(
    {[Symbol.iterator]: InstanceofType(Function)});

export function IterableOfType<T, I extends Iterable<T>>(type: Type<T>): Type<I> {
  return {
    check(target: any): target is I {
      if (!IterableType.check(target)) {
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
      return `Iterable<${type}>`;
    },
  };
}

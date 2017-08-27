import { HasPropertyType } from '../check/has-property-type';
import { InstanceofType } from '../check/instanceof-type';
import { NumberType } from '../check/number-type';
import { Type } from '../check/type';

/**
 * Checks if the elements of the given array are all of the given type.
 *
 * @param type Type of the elements.
 * @param <T> Type of the element.
 * @return The array type.
 */
export function CtorType<T = any>(): Type<gs.ICtor<T>> {
  return {
    /**
     * @override
     */
    check(target: any): target is gs.ICtor<T> {
      return InstanceofType(Function).check(target) &&
          HasPropertyType('length', NumberType).check(target);
    },

    toString(): string {
      return '(constructor)';
    },
  };
}

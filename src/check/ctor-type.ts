import { HasPropertyType } from '../check/has-property-type';
import { IType } from '../check/i-type';
import { InstanceofType } from '../check/instanceof-type';
import { NumberType } from '../check/number-type';

/**
 * Checks if the elements of the given array are all of the given type.
 *
 * @param type Type of the elements.
 * @param <T> Type of the element.
 * @return The array type.
 */
export function CtorType<T = any>(): IType<gs.ICtor<T>> {
  return {
    /**
     * @override
     */
    check(target: any): target is gs.ICtor<T> {
      return InstanceofType(Function).check(target) &&
          HasPropertyType('length', NumberType).check(target);
    },
  };
}

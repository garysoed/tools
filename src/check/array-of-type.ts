import { IType } from '../check/i-type';
import { InstanceofType } from '../check/instanceof-type';

/**
 * Checks if the elements of the given array are all of the given type.
 *
 * @param type Type of the elements.
 * @param <T> Type of the element.
 * @return The array type.
 */
export function ArrayOfType<T>(type: IType<T>): IType<T[]> {
  return {
    /**
     * @override
     */
    check(target: any): target is T[] {
      if (InstanceofType(Array).check(target)) {
        return target.every((element: any) => {
          return type.check(element);
        });
      } else {
        return false;
      }
    },
  };
}

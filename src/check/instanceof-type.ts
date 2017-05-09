import { IType } from '../check/i-type';


/**
 * Checks if the target is an instance of the given ctor.
 * @param ctor Ctor to check the type.
 * @return The instanceof type.
 */
export function InstanceofType<T>(ctor: gs.ICtor<T>): IType<T> {
  return {
    /**
     * @override
     */
    check(target: any): target is T {
      return target instanceof ctor;
    },
  };
}
// TODO: Mutable

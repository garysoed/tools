import { IType } from 'src/check/i-type';


/**
 * Checks if the target is non null.
 * @return The non null type.
 */
export function NonNullType<T>(): IType<T> {
  return {
    /**
     * @override
     */
    check(target: any): target is T {
      return target !== null;
    },
  };
}
// TODO: Mutable

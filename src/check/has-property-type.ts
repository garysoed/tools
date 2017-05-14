import { IType } from '../check/i-type';

export function HasPropertyType<T>(name: string | symbol, type: IType<any>): IType<T> {
  return {
    /**
     * @override
     */
    check(target: any): target is T {
      if (!target) {
        return false;
      }

      const value = target[name];
      return value !== undefined && type.check(value);
    },
  };
}

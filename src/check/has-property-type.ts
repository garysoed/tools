import { IType } from 'src/check/i-type';

export function HasPropertyType<T>(name: string, type: IType<any>): IType<T> {
  return {
    /**
     * @override
     */
    check(target: any): target is T {
      const value = target[name];
      return value !== undefined && type.check(value);
    },
  };
};

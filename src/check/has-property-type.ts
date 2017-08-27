import { Type } from '../check/type';

export function HasPropertyType<T>(name: string | symbol, type: Type<any>): Type<T> {
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

    toString(): string {
      return `{${name}: ${type}}`;
    },
  };
}

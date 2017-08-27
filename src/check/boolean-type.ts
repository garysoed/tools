import { Type } from '../check/type';

export const BooleanType: Type<boolean> = {
  /**
   * @override
   */
  check(target: any): target is boolean {
    return typeof target === 'boolean' || target instanceof Boolean;
  },

  toString(): string {
    return 'boolean';
  },
};

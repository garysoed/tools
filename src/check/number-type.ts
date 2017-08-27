import { Type } from '../check/type';

export const NumberType: Type<number> = {
  /**
   * @override
   */
  check(target: any): target is number {
    return typeof target === 'number' || target instanceof Number;
  },

  toString(): string {
    return 'number';
  },
};

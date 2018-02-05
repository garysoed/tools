import { Type } from '../check';

export const UndefinedType: Type<undefined> = {
  /**
   * @override
   */
  check(target: any): target is undefined {
    return target === undefined;
  },

  toString(): string {
    return 'undefined';
  },
};

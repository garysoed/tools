import { Type } from '../check';

export const NullType: Type<null> = {
  /**
   * @override
   */
  check(target: any): target is null {
    return target === null;
  },

  toString(): string {
    return 'null';
  },
};

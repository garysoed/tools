import { Type } from '../check/type';

export const StringType: Type<string> = {
  /**
   * @override
   */
  check(target: any): target is string {
    return typeof target === 'string' || target instanceof String;
  },

  toString(): string {
    return 'string';
  },
};

import { Type } from '../check/type';

export const SymbolType: Type<symbol> = {
  /**
   * @override
   */
  check(target: any): target is symbol {
    return typeof target === 'symbol';
  },

  toString(): string {
    return 'symbol';
  },
};

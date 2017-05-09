import { IType } from '../check/i-type';

export const SymbolType: IType<symbol> = {
  /**
   * @override
   */
  check(target: any): target is symbol {
    return typeof target === 'symbol';
  },
};
// TODO: Mutable

import { IType } from '../check/i-type';

export const NumberType: IType<number> = {
  /**
   * @override
   */
  check(target: any): target is number {
    return typeof target === 'number' || target instanceof Number;
  },
};
// TODO: Mutable

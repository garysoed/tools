import { IType } from '../check/i-type';

export const BooleanType: IType<boolean> = {
  /**
   * @override
   */
  check(target: any): target is boolean {
    return typeof target === 'boolean' || target instanceof Boolean;
  },
};

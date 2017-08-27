import { IType } from '../check';

export const NullType: IType<null> = {
  /**
   * @override
   */
  check(target: any): target is null {
    return target === null;
  },
};

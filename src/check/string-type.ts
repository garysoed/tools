import { IType } from '../check/i-type';

export const StringType: IType<string> = {
  /**
   * @override
   */
  check(target: any): target is string {
    return typeof target === 'string' || target instanceof String;
  },
};
// TODO: Mutable

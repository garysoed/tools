import {VerifyUtil} from './verify-util';


export function verify<T>(instance: T): T;
export function verify(instance: any): any {
  return VerifyUtil.create(instance, false /* reversed */);
}

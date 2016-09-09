import {VerifyUtil} from './verify-util';


export function verifyNever(instance: Function): Function;
export function verifyNever<T>(instance: T): T;
export function verifyNever(instance: any): any {
  return VerifyUtil.create(instance, true /* reversed */);
}

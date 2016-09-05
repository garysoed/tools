import {AnyAssert} from './any-assert';
import {AssertFactory} from './assert-factory';
import {BooleanAssert} from './boolean-assert';
import {Natives} from '../typescript/natives';
import {StringAssert} from './string-assert';


/**
 * Wraps jasmine's expect to add type safetiness.
 */
export function assert(value: string | null): AssertFactory<StringAssert>;
export function assert(value: boolean | null): AssertFactory<BooleanAssert>;
export function assert(value: any): AssertFactory<AnyAssert> {
  if (Natives.isBoolean(value)) {
    return new AssertFactory((reversed: boolean): BooleanAssert => {
      return new BooleanAssert(value, reversed, expect);
    });
  } else if (Natives.isString(value)) {
    return new AssertFactory((reversed: boolean): StringAssert => {
      return new StringAssert(value, reversed, expect);
    });
  } else {
    throw Error(`Unhandled value type: ${value}`);
  }
}

import {AnyAssert} from './any-assert';
import {ArrayAssert} from './array-assert';
import {AssertFactory} from './assert-factory';
import {BooleanAssert} from './boolean-assert';
import {FunctionAssert} from './function-assert';
import {Natives} from '../typescript/natives';
import {NumberAssert} from './number-assert';
import {StringAssert} from './string-assert';


/**
 * Wraps jasmine's expect to add type safetiness.
 */
export function assert(value: boolean | null): AssertFactory<BooleanAssert>;
export function assert(value: Function | null): AssertFactory<FunctionAssert>;
export function assert(value: number | null): AssertFactory<NumberAssert>;
export function assert(value: string | null): AssertFactory<StringAssert>;

export function assert<T>(value: T[] | null): AssertFactory<ArrayAssert<T>>;
export function assert(value: any): AssertFactory<AnyAssert<any>>;
export function assert(value: any): AssertFactory<AnyAssert<any>> {
  if (Natives.isBoolean(value)) {
    return new AssertFactory((reversed: boolean): BooleanAssert => {
      return new BooleanAssert(value, reversed, expect);
    });
  } else if (Natives.isString(value)) {
    return new AssertFactory((reversed: boolean): StringAssert => {
      return new StringAssert(value, reversed, expect);
    });
  } else if (Natives.isNumber(value)) {
    return new AssertFactory((reversed: boolean): NumberAssert => {
      return new NumberAssert(value, reversed, expect);
    });
  } else if (value instanceof Function) {
    return new AssertFactory((reversed: boolean): FunctionAssert => {
      return new FunctionAssert(value, reversed, expect);
    });
  } else if (value instanceof Array) {
    return new AssertFactory((reversed: boolean): ArrayAssert<any> => {
      return new ArrayAssert<any>(value, reversed, expect);
    });
  } else {
    return new AssertFactory((reversed: boolean): AnyAssert<any> => {
      return new AnyAssert(value, reversed, expect);
    });
  }
}

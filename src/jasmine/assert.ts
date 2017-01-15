import {Natives} from '../typescript/natives';

import {AnyAssert} from './any-assert';
import {ArrayAssert} from './array-assert';
import {AssertFactory} from './assert-factory';
import {BaseAssert} from './base-assert';
import {BooleanAssert} from './boolean-assert';
import {ElementAssert} from './element-assert';
import {FunctionAssert} from './function-assert';
import {MapAssert} from './map-assert';
import {NumberAssert} from './number-assert';
import {SetAssert} from './set-assert';
import {StringAssert} from './string-assert';


/**
 * Wraps jasmine's expect to add type safetiness.
 */
export function assert(value: boolean | null): AssertFactory<BooleanAssert>;
export function assert(value: number | null): AssertFactory<NumberAssert>;
export function assert(value: string | null): AssertFactory<StringAssert>;
export function assert(value: Element): AssertFactory<ElementAssert>;

export function assert<T extends Function>(value: T | null): AssertFactory<FunctionAssert<T>>;
export function assert<T>(value: T[] | null): AssertFactory<ArrayAssert<T>>;
export function assert<K, V>(value: Map<K, V>): AssertFactory<MapAssert<K, V>>;
export function assert<T>(value: Set<T>): AssertFactory<SetAssert<T>>;
export function assert(value: any): AssertFactory<AnyAssert<any>>;
export function assert(value: any): AssertFactory<BaseAssert> {
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
  } else if (value instanceof Element) {
    return new AssertFactory((reversed: boolean): ElementAssert => {
      return new ElementAssert(value, reversed, expect);
    });
  } else if (value instanceof Function) {
    return new AssertFactory((reversed: boolean): FunctionAssert<any> => {
      return new FunctionAssert(value, reversed, expect);
    });
  } else if (value instanceof Array) {
    return new AssertFactory((reversed: boolean): ArrayAssert<any> => {
      return new ArrayAssert<any>(value, reversed, expect);
    });
  } else if (value instanceof Map) {
    return new AssertFactory((reversed: boolean): MapAssert<any, any> => {
      return new MapAssert<any, any>(value, reversed, expect);
    });
  } else if (value instanceof Set) {
    return new AssertFactory((reversed: boolean): SetAssert<any> => {
      return new SetAssert<any>(value, reversed, expect);
    });
  } else {
    return new AssertFactory((reversed: boolean): AnyAssert<any> => {
      return new AnyAssert(value, reversed, expect);
    });
  }
}

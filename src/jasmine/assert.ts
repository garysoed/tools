import { BooleanType } from '../check/boolean-type';
import { FiniteIterableType } from '../check/finite-iterable-type';
import { HasPropertyType } from '../check/has-property-type';
import { InstanceofType } from '../check/instanceof-type';
import { IntersectType } from '../check/intersect-type';
import { IterableType } from '../check/iterable-type';
import { NumberType } from '../check/number-type';
import { StringType } from '../check/string-type';
import { Finite } from '../interfaces/finite';
import { AnyAssert } from '../jasmine/any-assert';
import { ArrayAssert } from '../jasmine/array-assert';
import { AssertFactory } from '../jasmine/assert-factory';
import { BaseAssert } from '../jasmine/base-assert';
import { BooleanAssert } from '../jasmine/boolean-assert';
import { ElementAssert } from '../jasmine/element-assert';
import { FiniteIterableAssert } from '../jasmine/finite-iterable-assert';
import { FunctionAssert } from '../jasmine/function-assert';
import { IterableAssert } from '../jasmine/iterable-assert';
import { MapAssert } from '../jasmine/map-assert';
import { NumberAssert } from '../jasmine/number-assert';
import { PromiseAssert } from '../jasmine/promise-assert';
import { SetAssert } from '../jasmine/set-assert';
import { StringAssert } from '../jasmine/string-assert';


/**
 * Wraps jasmine's expect to add type safetiness.
 */
export function assert(value: boolean | null): AssertFactory<BooleanAssert>;
export function assert(value: number | null): AssertFactory<NumberAssert>;
export function assert(value: string | null): AssertFactory<StringAssert>;
export function assert(value: Element): AssertFactory<ElementAssert>;

export function assert<T>(value: Promise<T>): AssertFactory<PromiseAssert<T>>;
export function assert<T extends Function>(value: T | null): AssertFactory<FunctionAssert<T>>;
export function assert<T>(value: T[] | null): AssertFactory<ArrayAssert<T>>;
export function assert<K, V>(value: Map<K, V>): AssertFactory<MapAssert<K, V>>;
export function assert<T>(value: Set<T>): AssertFactory<SetAssert<T>>;
export function assert<T>(
    iterable: Finite<T> & Iterable<T>): AssertFactory<FiniteIterableAssert<T>>;
export function assert<T>(iterable: Iterable<T>): AssertFactory<IterableAssert<T>>;
export function assert(value: any): AssertFactory<AnyAssert<any>>;
export function assert(value: any): AssertFactory<BaseAssert> {
  if (BooleanType.check(value)) {
    return new AssertFactory((reversed: boolean): BooleanAssert => {
      return new BooleanAssert(value, reversed, expect);
    });
  } else if (StringType.check(value)) {
    return new AssertFactory((reversed: boolean): StringAssert => {
      return new StringAssert(value, reversed, expect);
    });
  } else if (NumberType.check(value)) {
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
  } else if (value instanceof Promise) {
    return new AssertFactory((reversed: boolean): PromiseAssert<any> => {
      return new PromiseAssert<any>(value, fail, reversed, expect);
    });
  } else if (FiniteIterableType.check(value)) {
    return new AssertFactory((reversed: boolean): FiniteIterableAssert<any> => {
      return new FiniteIterableAssert<any>(value, reversed, expect);
    });
  } else if (IterableType.check(value)) {
    return new AssertFactory((reversed: boolean): IterableAssert<any> => {
      return new IterableAssert<any>(value, reversed, expect);
    });
  } else {
    return new AssertFactory((reversed: boolean): AnyAssert<any> => {
      return new AnyAssert(value, reversed, expect);
    });
  }
}

import {TestBase} from '../test-base';
TestBase.setup();

import {assert} from './assert';
import {AnyAssert} from './any-assert';
import {ArrayAssert} from './array-assert';
import {BooleanAssert} from './boolean-assert';
import {FunctionAssert} from './function-assert';
import {NumberAssert} from './number-assert';
import {StringAssert} from './string-assert';


describe('jasmine.assert', () => {
  it('should return the correct assert for boolean values', () => {
    expect(assert(true).to).toEqual(jasmine.any(BooleanAssert));
  });

  it('should return the correct assert for string values', () => {
    expect(assert('string').to).toEqual(jasmine.any(StringAssert));
  });

  it('should return the correct assert for number values', () => {
    expect(assert(123).to).toEqual(jasmine.any(NumberAssert));
  });

  it('should return the correct assert for function values', () => {
    expect(assert(() => undefined).to).toEqual(jasmine.any(FunctionAssert));
  });

  fit('should return the correct assert for array values', () => {
    expect(assert([]).to).toEqual(jasmine.any(ArrayAssert));
  });

  fit('should return the correct assert for other values', () => {
    expect(assert({}).to).toEqual(jasmine.any(AnyAssert));
  });
});

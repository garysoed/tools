import {TestBase} from '../test-base';
TestBase.setup();

import {assert} from './assert';
import {BooleanAssert} from './boolean-assert';
import {StringAssert} from './string-assert';


describe('jasmine.assert', () => {
  it('should return the correct assert for boolean values', () => {
    expect(assert(true).to).toEqual(jasmine.any(BooleanAssert));
  });

  it('should return the correct assert for string values', () => {
    expect(assert('string').to).toEqual(jasmine.any(StringAssert));
  });
});

import { assert, TestBase } from '../test-base';
TestBase.setup();

import { NullableType, NumberType } from '../check';


describe('check.NullableType', () => {
  describe('check', () => {
    it(`should return true if the type is the inner type`, () => {
      assert(NullableType(NumberType).check(123)).to.beTrue();
    });

    it(`should return true if the type is null`, () => {
      assert(NullableType(NumberType).check(null)).to.beTrue();
    });

    it(`should return false if the type is not the inner type or null`, () => {
      assert(NullableType(NumberType).check('abc')).to.beFalse();
    });
  });
});

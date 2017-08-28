import { assert, TestBase } from '../test-base';
TestBase.setup();

import { NumberType, StringType, TupleOfType } from '../check';


describe('check.TupleOfType', () => {
  describe('check', () => {
    it(`should return true if the target is tuple of the correct type`, () => {
      assert(TupleOfType([NumberType, StringType]).check([1, '1'])).to.beTrue();
    });

    it(`should return false if the tuple element has the wrong type`, () => {
      assert(TupleOfType([NumberType, StringType]).check([1, 2])).to.beFalse();
    });

    it(`should return false if the target is not an Object`, () => {
      assert(TupleOfType([NumberType, StringType]).check(123)).to.beFalse();
    });
  });
});

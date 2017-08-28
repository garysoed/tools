import { assert, TestBase } from '../test-base';
TestBase.setup();

import { IterableOfType, NumberType } from '../check';

describe('check.IterableOfType', () => {
  describe('check', () => {
    it(`should return true if the target is an iterable with the correct elements`, () => {
      assert(IterableOfType(NumberType).check([1, 2, 3])).to.beTrue();
    });

    it(`should return false if one of the elements is of the wrong type`, () => {
      assert(IterableOfType(NumberType).check([1, '2', 3])).to.beFalse();
    });

    it(`should return false if not an iterable`, () => {
      assert(IterableOfType(NumberType).check(123)).to.beFalse();
    });
  });
});

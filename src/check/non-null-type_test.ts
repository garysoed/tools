import { assert, TestBase } from '../test-base';
TestBase.setup();

import { NonNullType } from '../check/non-null-type';


describe('check.NonNullType', () => {
  describe('check', () => {
    it('should return true if the target is non null', () => {
      assert(NonNullType<string>().check('abc')).to.beTrue();
    });

    it('should return false if the target is null', () => {
      assert(NonNullType<string>().check(null)).to.beFalse();
    });
  });
});

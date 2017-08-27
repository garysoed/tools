import { assert, TestBase } from '../test-base';
TestBase.setup();

import { NullType } from '../check';


describe('check.NullType', () => {
  describe('check', () => {
    it(`should return true if the target is null`, () => {
      assert(NullType.check(null)).to.beTrue();
    });

    it(`should return false if the target is not null`, () => {
      assert(NullType.check('blah')).to.beFalse();
    });
  });
});

import { assert, TestBase } from '../test-base';
TestBase.setup();

import { InstanceofType } from '../check/instanceof-type';


describe('check.InstanceofType', () => {
  describe('check', () => {
    it('should return true if the target is an instance of the given constructor', () => {
      assert(InstanceofType(Array).check([])).to.beTrue();
    });

    it('should return false if the target is not an instance of the given constructor', () => {
      assert(InstanceofType(Array).check(123)).to.beFalse();
    });
  });
});

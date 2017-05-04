import { assert, TestBase } from '../test-base';
TestBase.setup();

import { CtorType } from '../check/ctor-type';


class TestClass { }

describe('check.CtorType', () => {
  describe('check', () => {
    it('should return true if the target is a constructor', () => {
      assert(CtorType<TestClass>().check(TestClass)).to.beTrue();
    });

    it('should return false if the target is not a constructor', () => {
      assert(CtorType<TestClass>().check(123)).to.beFalse();
    });
  });
});

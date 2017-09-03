import { assert, TestBase } from '../test-base';
TestBase.setup();

import { EnumType } from '../check';


describe('check.EnumType', () => {
  describe('check', () => {
    it(`should return true if the value is in the enum`, () => {
      enum Test { A, B }
      assert(EnumType(Test).check(Test.A)).to.beTrue();
    });

    it(`should return false if the value is not in the enum`, () => {
      enum Test { A, B }
      enum Test2 { A, B, C }

      assert(EnumType(Test).check(Test2.C)).to.beFalse();
    });
  });
});

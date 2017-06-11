import { assert, TestBase } from '../test-base';
TestBase.setup();

import { TestSpec } from '../testgen/test-spec';


describe('testgen.TestSpec', () => {
  describe('or', () => {
    it(`should return the correct test spec`, () => {
      assert(TestSpec.of([1, 2]).or(TestSpec.of([3, 4])).values).to.haveElements([1, 2, 3, 4]);
    });
  });
});

import { assert, TestBase } from '../test-base';
TestBase.setup();

import { gentest } from '../testgen/gentest';
import { NumberSpec } from '../testgen/number-spec';


describe('testgen.TestGen', () => {
  describe('somemethod', () => {
    gentest(
        {a: NumberSpec.positive.or(NumberSpec.negative)},
        ({a}) => {
      it(`should test with "a" being: ${a}`, () => {
        assert(a).toNot.be(0);
      });
    });
  });
});

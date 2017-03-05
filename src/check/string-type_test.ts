import { assert, TestBase } from '../test-base';
TestBase.setup();

import {StringType} from '../check/string-type';


describe('check.StringType', () => {
  describe('isString', () => {
    it('should return true if the value is a native string', () => {
      assert(StringType.check('string')).to.beTrue();
    });

    it('should return true if the value is a String object', () => {
      assert(StringType.check(String('string'))).to.beTrue();
    });

    it('should return false otherwise', () => {
      assert(StringType.check(Symbol('symbol'))).to.beFalse();
    });
  });
});

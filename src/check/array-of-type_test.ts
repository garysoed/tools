import { assert, TestBase } from '../test-base';
TestBase.setup();

import { ArrayOfType } from '../check/array-of-type';
import { StringType } from '../check/string-type';


describe('check.ArrayOfType', () => {
  describe('check', () => {
    it('should return true if all the elements passes the given type', () => {
      assert(ArrayOfType(StringType).check(['a', 'b', 'c'])).to.beTrue();
    });

    it('should return false if an element in the array does not pass the given type', () => {
      assert(ArrayOfType(StringType).check(['a', 1, 'c'])).to.beFalse();
    });
  });
});

import { assert, TestBase } from '../test-base';
TestBase.setup();

import { InjectUtil } from './inject-util';


describe('inject.InjectUtil', () => {
  describe('getMetadata', () => {
    it('should return the same cache mapping', () => {
      class TestClass {}
      assert(InjectUtil.getMetadataMap(TestClass)).to.be(InjectUtil.getMetadataMap(TestClass));
    });
  });
});

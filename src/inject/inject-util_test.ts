import { assert, TestBase } from 'gs-testing/export/main';
TestBase.setup();

import { InjectUtil } from './inject-util';


describe('inject.InjectUtil', () => {
  describe('getMetadata', () => {
    should('return the same cache mapping', () => {
      class TestClass {}
      assert(InjectUtil.getMetadataMap(TestClass)).to.be(InjectUtil.getMetadataMap(TestClass));
    });
  });
});

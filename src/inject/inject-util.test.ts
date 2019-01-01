import { assert, should } from 'gs-testing/export/main';
import { InjectUtil } from './inject-util';


describe('inject.InjectUtil', () => {
  describe('getMetadata', () => {
    should('return the same cache mapping', () => {
      class TestClass {}
      assert(InjectUtil.getMetadataMap(TestClass)).to.equal(InjectUtil.getMetadataMap(TestClass));
    });
  });
});

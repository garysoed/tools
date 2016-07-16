import {TestBase} from '../test-base';
TestBase.setup();

import {InjectUtil} from './inject-util';


describe('inject.InjectUtil', () => {
  describe('getMetadata', () => {
    it('should return the same cache mapping', () => {
      class TestClass {}
      expect(InjectUtil.getMetadataMap(TestClass)).toBe(InjectUtil.getMetadataMap(TestClass));
    });
  });
});

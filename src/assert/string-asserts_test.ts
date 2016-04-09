import TestBase from '../test-base';
TestBase.setup();

import StringAsserts from './string-asserts';


describe('assert.StringAsserts', () => {
  describe('isNotEmpty', () => {
    it('should throw error if empty', () => {
      let message = 'message';
      expect(() => {
        StringAsserts.isNotEmpty('', message);
      }).toThrowError(message);
    });

    it('should not throw error if not empty', () => {
      expect(() => {
        StringAsserts.isNotEmpty('notEmpty');
      }).not.toThrow();
    });
  });
});

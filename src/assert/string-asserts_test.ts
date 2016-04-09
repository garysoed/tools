import TestBase from '../test-base';
TestBase.setup();

import Asserts from './asserts';


describe('assert.StringAsserts', () => {
  describe('is.empty', () => {
    it('should not throw error if the string is empty', () => {
      expect(() => {
        Asserts.string('').is.empty().orThrows(Error());
      }).not.toThrow();
    });

    it('should throw error if the string is not empty', () => {
      let error = Error('error');
      expect(() => {
        Asserts.string('not empty').is.empty().orThrows(error);
      }).toThrow(error);
    });
  });

  describe('isNot.empty', () => {
    it('should not throw error if the string is not empty', () => {
      expect(() => {
        Asserts.string('not empty').isNot.empty().orThrows(Error());
      }).not.toThrow();
    });

    it('should throw error if the string is empty', () => {
      let error = Error('error');
      expect(() => {
        Asserts.string('').isNot.empty().orThrows(error);
      }).toThrow(error);
    });
  });
});

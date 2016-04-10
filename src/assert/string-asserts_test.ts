import TestBase from '../test-base';
TestBase.setup();

import Asserts from './asserts';


describe('assert.StringAsserts', () => {
  describe('to.beEmpty', () => {
    it('should not throw error if the string is empty', () => {
      expect(() => {
        Asserts.string('').to.beEmpty().orThrows(Error());
      }).not.toThrow();
    });

    it('should throw error if the string is not empty', () => {
      let error = Error('error');
      expect(() => {
        Asserts.string('not empty').to.beEmpty().orThrows(error);
      }).toThrow(error);
    });
  });

  describe('toNot.beEmpty', () => {
    it('should not throw error if the string is not empty', () => {
      expect(() => {
        Asserts.string('not empty').toNot.beEmpty().orThrows(Error());
      }).not.toThrow();
    });

    it('should throw error if the string is empty', () => {
      let error = Error('error');
      expect(() => {
        Asserts.string('').toNot.beEmpty().orThrows(error);
      }).toThrow(error);
    });
  });
});

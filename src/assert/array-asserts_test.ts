import TestBase from '../test-base';
TestBase.setup();

import Asserts from './asserts';


describe('assert.ArrayAsserts', () => {
  describe('to.beEmpty', () => {
    it('should not throw error if the array is empty', () => {
      expect(() => {
        Asserts.array([]).to.beEmpty().orThrows(Error('error'));
      }).not.toThrow();
    });

    it('should throw error if the array is not empty', () => {
      let error = Error('error');
      expect(() => {
        Asserts.array([1, 2, 3]).to.beEmpty().orThrows(error);
      }).toThrow(error);
    });
  });

  describe('toNot.beEmpty', () => {
    it('should throw error if the array is empty', () => {
      let error = Error('error');
      expect(() => {
        Asserts.array([]).toNot.beEmpty().orThrows(error);
      }).toThrow(error);
    });

    it('should not throw error if the array is not empty', () => {
      expect(() => {
        Asserts.array([1, 2, 3]).toNot.beEmpty().orThrows(Error('error'));
      }).not.toThrow();
    });
  });

  describe('to.contain', () => {
    it('should not throw error if the element is in the array', () => {
      expect(() => {
        Asserts.array([1, 2, 3]).to.contain(2).orThrows(Error('error'));
      }).not.toThrow();
    });

    it('should throw error if the element is not in the array', () => {
      let error = Error('error');
      expect(() => {
        Asserts.array([1, 2, 3]).to.contain(5).orThrows(error);
      }).toThrow(error);
    });
  });

  describe('toNot.contain', () => {
    it('should throw error if the element is in the array', () => {
      let error = Error('error');
      expect(() => {
        Asserts.array([1, 2, 3]).toNot.contain(2).orThrows(error);
      }).toThrow(error);
    });

    it('should not throw error if the element is not in the array', () => {
      expect(() => {
        Asserts.array([1, 2, 3]).toNot.contain(5).orThrows(Error('error'));
      }).not.toThrow();
    });
  });
});

import TestBase from '../test-base';
TestBase.setup();

import Asserts from './asserts';


describe('assert.SetAsserts', () => {
  describe('to.beEmpty', () => {
    it('should not throw error if the set is empty', () => {
      expect(() => {
        Asserts.set(new Set<string>()).to.beEmpty().orThrows('error');
      }).not.toThrow();
    });

    it('should throw error if the set is not empty', () => {
      expect(() => {
        Asserts.set(new Set<number>([1, 2, 3])).to.beEmpty().orThrows('error');
      }).toThrowError(/error/);
    });
  });

  describe('toNot.beEmpty', () => {
    it('should throw error if the set is empty', () => {
      expect(() => {
        Asserts.set(new Set<number>()).toNot.beEmpty().orThrows('error');
      }).toThrowError(/error/);
    });

    it('should not throw error if the set is not empty', () => {
      expect(() => {
        Asserts.set(new Set<number>([1, 2, 3])).toNot.beEmpty().orThrows('error');
      }).not.toThrow();
    });
  });

  describe('to.contain', () => {
    it('should not throw error if the element is in the set', () => {
      expect(() => {
        Asserts.set(new Set<number>([1, 2, 3])).to.contain(2).orThrows('error');
      }).not.toThrow();
    });

    it('should throw error if the element is not in the set', () => {
      expect(() => {
        Asserts.set(new Set<number>([1, 2, 3])).to.contain(5).orThrows('error');
      }).toThrowError(/error/);
    });
  });

  describe('toNot.contain', () => {
    it('should throw error if the element is in the array', () => {
      expect(() => {
        Asserts.array([1, 2, 3]).toNot.contain(2).orThrows('error');
      }).toThrowError(/error/);
    });

    it('should not throw error if the element is not in the array', () => {
      expect(() => {
        Asserts.array([1, 2, 3]).toNot.contain(5).orThrows('error');
      }).not.toThrow();
    });
  });
});

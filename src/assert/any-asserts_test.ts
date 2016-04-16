import TestBase from '../test-base';
TestBase.setup();

import Asserts from './asserts';


describe('assert.AnyAsserts', () => {
  describe('to.beDefined', () => {
    it('should not throw error if the value is defined', () => {
      expect(() => {
        Asserts.any('defined').to.beDefined().orThrows('error');
      }).not.toThrow();
    });

    it('should not throw error if the value is null', () => {
      expect(() => {
        Asserts.any(null).to.beDefined().orThrows('error');
      }).not.toThrow();
    });

    it('should throw error if the value is undefined', () => {
      expect(() => {
        Asserts.any(undefined).to.beDefined().orThrows('error');
      }).toThrowError(/error/);
    });
  });

  describe('toNot.beDefined', () => {
    it('should throw error if the value is defined', () => {
      expect(() => {
        Asserts.any('defined').toNot.beDefined().orThrows('error');
      }).toThrowError(/error/);
    });

    it('should throw error if the value is null', () => {
      expect(() => {
        Asserts.any(null).toNot.beDefined().orThrows('error');
      }).toThrowError(/error/);
    });

    it('should not throw error if the value is undefined', () => {
      expect(() => {
        Asserts.any(undefined).toNot.beDefined().orThrows('error');
      }).not.toThrow();
    });
  });

  describe('to.beEqual', () => {
    it('should not throw error if the value is equal to the reference value', () => {
      expect(() => {
        Asserts.any(1).to.beEqual(1).orThrows('error');
      }).not.toThrow();
    });

    it('should throw error if the value is not equal to the reference value', () => {
      expect(() => {
        Asserts.any(1).to.beEqual(2).orThrows('error');
      }).toThrowError(/error/);
    });
  });

  describe('toNot.beEqual', () => {
    it('should not throw error if the value is not equal to the reference value', () => {
      expect(() => {
        Asserts.any(1).toNot.beEqual(2).orThrows('error');
      }).not.toThrow();
    });

    it('should throw error if the value is equal to the reference value', () => {
      expect(() => {
        Asserts.any(1).toNot.beEqual(1).orThrows('error');
      }).toThrowError(/error/);
    });
  });
});

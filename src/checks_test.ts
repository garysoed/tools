import TestBase from './test-base';
TestBase.setup();

import Checks from './checks';

describe('Checks', () => {
  describe('isArrayOf', () => {
    it('should return true if the object is the correct array type', () => {
      expect(Checks.isArrayOf(['a', 'b', 'c'], String)).toEqual(true);
    });

    it('should return false if an element of the array is of the wrong type', () => {
      expect(Checks.isArrayOf(['1', 2, '3'], String)).toEqual(false);
    });

    it('should return false if the object is not an array', () => {
      expect(Checks.isArrayOf({}, String)).toEqual(false);
    });
  });

  describe('isCtor', () => {
    class TestClass { }

    it('should return true if the object is a constructor', () => {
      expect(Checks.isCtor(TestClass)).toEqual(true);
    });

    it('should return false if the object is not a function', () => {
      expect(Checks.isCtor(1)).toEqual(false);
    });
  });

  describe('isInstanceOf', () => {
    class TestClass {}

    it('should return true if the object is of the correct type', () => {
      expect(Checks.isInstanceOf(new TestClass(), TestClass)).toEqual(true);
    });

    it('should return false if the object is of the wrong type', () => {
      expect(Checks.isInstanceOf('blah', TestClass)).toEqual(false);
    });

    it('should handle strings', () => {
      expect(Checks.isInstanceOf('string', String)).toEqual(true);
    });

    it('should handler new String', () => {
      /* tslint:disable:no-construct */
      expect(Checks.isInstanceOf(new String(), String)).toEqual(true);
      /* tslint:enable:no-construct */
    });

    it('should handle booleans', () => {
      expect(Checks.isInstanceOf(true, Boolean)).toEqual(true);
    });

    it('should handle new Booleans', () => {
      /* tslint:disable:no-construct */
      expect(Checks.isInstanceOf(new Boolean(), Boolean)).toEqual(true);
      /* tslint:enable:no-construct */
    });
  });

  describe('isRecordOf', () => {
    it('should return true if the object is a record with the correct value', () => {
      expect(Checks.isRecordOf({'a': true, 'b': false}, Boolean)).toEqual(true);
    });

    it('should return false if a value in the record is not the correct type', () => {
      expect(Checks.isRecordOf({'a': true, 'b': 'false'}, Boolean)).toEqual(false);
    });

    it('should return false if the object is not an Object', () => {
      expect(Checks.isRecordOf(1, Boolean)).toEqual(false);
    });
  });
});

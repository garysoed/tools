import { assert, TestBase } from '../test-base';
TestBase.setup();

import { Checks } from './checks';


describe('Checks', () => {
  describe('isArrayOf', () => {
    it('should return true if the object is the correct array type', () => {
      assert(Checks.isArrayOf(['a', 'b', 'c'], String)).to.beTrue();
    });

    it('should return false if an element of the array is of the wrong type', () => {
      assert(Checks.isArrayOf(['1', 2, '3'], String)).to.beFalse();
    });

    it('should return false if the object is not an array', () => {
      assert(Checks.isArrayOf({}, String)).to.beFalse();
    });
  });

  describe('isCtor', () => {
    class TestClass { }

    it('should return true if the object is a constructor', () => {
      assert(Checks.isCtor(TestClass)).to.beTrue();
    });

    it('should return false if the object is not a function', () => {
      assert(Checks.isCtor(1)).to.beFalse();
    });
  });

  describe('isInstanceOf', () => {
    class TestClass {}

    it('should return true if the object is of the correct type', () => {
      assert(Checks.isInstanceOf(new TestClass(), TestClass)).to.beTrue();
    });

    it('should return false if the object is of the wrong type', () => {
      assert(Checks.isInstanceOf('blah', TestClass)).to.beFalse();
    });

    it('should handle strings', () => {
      assert(Checks.isInstanceOf('string', String)).to.beTrue();
    });

    it('should handler new String', () => {
      /* tslint:disable:no-construct */
      assert(Checks.isInstanceOf(new String(), String)).to.beTrue();
      /* tslint:enable:no-construct */
    });

    it('should handle booleans', () => {
      assert(Checks.isInstanceOf(true, Boolean)).to.beTrue();
    });

    it('should handle new Booleans', () => {
      /* tslint:disable:no-construct */
      assert(Checks.isInstanceOf(new Boolean(), Boolean)).to.beTrue();
      /* tslint:enable:no-construct */
    });
  });

  describe('isRecordOf', () => {
    it('should return true if the object is a record with the correct value', () => {
      assert(Checks.isRecordOf({'a': true, 'b': false}, Boolean)).to.beTrue();
    });

    it('should return false if a value in the record is not the correct type', () => {
      assert(Checks.isRecordOf({'a': true, 'b': 'false'}, Boolean)).to.beFalse();
    });

    it('should return false if the object is not an Object', () => {
      assert(Checks.isRecordOf(1, Boolean)).to.beFalse();
    });
  });
});

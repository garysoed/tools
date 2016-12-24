import {assert, TestBase} from 'src/test-base';
TestBase.setup();

import {Validate} from './validate';


describe('valid.AnyValidations', () => {
  describe('to.beAnInstanceOf', () => {
    it('should pass if the value is an instance of its ctor', () => {
      class Class {}

      let instance = new Class();
      let result = Validate.any(instance).to.beAnInstanceOf(Class);
      assert(result.isValid()).to.beTrue();
    });

    it('should pass if the value is an instance of its parent class', () => {
      class ParentClass {}
      class Class extends ParentClass {}

      let instance = new Class();
      let result = Validate.any(instance).to.beAnInstanceOf(ParentClass);
      assert(result.isValid()).to.beTrue();
    });

    it('should not pass if the value is not an instance of its class', () => {
      class OtherClass {}
      class Class {}

      let instance = new Class();
      let result = Validate.any(instance).to.beAnInstanceOf(OtherClass);
      assert(result.isValid()).to.beFalse();
    });
  });

  describe('toNot.beAnInstanceOf', () => {
    it('should not pass if the value is an instance of its ctor', () => {
      class Class {}

      let instance = new Class();
      let result = Validate.any(instance).toNot.beAnInstanceOf(Class);
      assert(result.isValid()).to.beFalse();
      assert(result.getErrorMessage()).to.match(/to not be an instance of/);
    });

    it('should not pass if the value is an instance of its parent class', () => {
      class ParentClass {}
      class Class extends ParentClass {}

      let instance = new Class();
      let result = Validate.any(instance).toNot.beAnInstanceOf(ParentClass);
      assert(result.isValid()).to.beFalse();
      assert(result.getErrorMessage()).to.match(/to not be an instance of/);
    });

    it('should pass if the value is not an instance of its class', () => {
      class OtherClass {}
      class Class {}

      let instance = new Class();
      let result = Validate.any(instance).toNot.beAnInstanceOf(OtherClass);
      assert(result.isValid()).to.beTrue();
    });
  });

  describe('to.beDefined', () => {
    it('should pass if the value is defined', () => {
      let result = Validate.any('defined').to.beDefined();
      assert(result.isValid()).to.beTrue();
    });

    it('should pass if the value is null', () => {
      let result = Validate.any(null).to.beDefined();
      assert(result.isValid()).to.beTrue();
    });

    it('should not pass if the value is undefined', () => {
      let result = Validate.any(undefined).to.beDefined();
      assert(result.isValid()).to.beFalse();
      assert(result.getErrorMessage()).to.match(/to be defined/);
    });
  });

  describe('toNot.beDefined', () => {
    it('should not pass if the value is defined', () => {
      let result = Validate.any('defined').toNot.beDefined();
      assert(result.isValid()).to.beFalse();
      assert(result.getErrorMessage()).to.match(/to not be defined/);
    });

    it('should not pass if the value is null', () => {
      let result = Validate.any(null).toNot.beDefined();
      assert(result.isValid()).to.beFalse();
      assert(result.getErrorMessage()).to.match(/to not be defined/);
    });

    it('should pass if the value is undefined', () => {
      let result = Validate.any(undefined).toNot.beDefined();
      assert(result.isValid()).to.beTrue();
    });
  });

  describe('to.beEqualTo', () => {
    it('should pass if the value is equal to the reference value', () => {
      let result = Validate.any(1).to.beEqualTo(1);
      assert(result.isValid()).to.beTrue();
    });

    it('should not pass if the value is not equal to the reference value', () => {
      let result = Validate.any(1).to.beEqualTo(2);
      assert(result.isValid()).to.beFalse();
      assert(result.getErrorMessage()).to.match(/to be equal to 2/);
    });
  });

  describe('toNot.beEqual', () => {
    it('should pass if the value is not equal to the reference value', () => {
      let result = Validate.any(1).toNot.beEqualTo(2);
      assert(result.isValid()).to.beTrue();
    });

    it('should not pass if the value is equal to the reference value', () => {
      let result = Validate.any(1).toNot.beEqualTo(1);
      assert(result.isValid()).to.beFalse();
      assert(result.getErrorMessage()).to.match(/to not be equal to 1/);
    });
  });

  describe('to.exist', () => {
    it('should pass if the value is not null or undefined', () => {
      let result = Validate.any(1).to.exist();
      assert(result.isValid()).to.beTrue();
    });

    it('should not pass if the value is null', () => {
      let result = Validate.any(null).to.exist();
      assert(result.isValid()).to.beFalse();
    });

    it('should not pass if the value is undefined', () => {
      let result = Validate.any(undefined).to.exist();
      assert(result.isValid()).to.beFalse();
    });
  });

  describe('toNot.exist', () => {
    it('should not pass if the value is not null or undefined', () => {
      let result = Validate.any(1).toNot.exist();
      assert(result.isValid()).to.beFalse();
    });

    it('should pass if the value is null', () => {
      let result = Validate.any(null).toNot.exist();
      assert(result.isValid()).to.beTrue();
    });

    it('should pass if the value is undefined', () => {
      let result = Validate.any(undefined).toNot.exist();
      assert(result.isValid()).to.beTrue();
    });
  });
});

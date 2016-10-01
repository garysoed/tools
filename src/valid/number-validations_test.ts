import {assert, TestBase} from '../test-base';
TestBase.setup();

import {Validate} from './validate';


describe('valid.NumberValidations', () => {
  describe('to.beGreaterThan', () => {
    it('should pass if the number is greater than the given number', () => {
      assert(Validate.number(2).to.beGreaterThan(1).getPasses()).to.beTrue();
    });

    it('should not pass if the number is equal to the given number', () => {
      assert(Validate.number(2).to.beGreaterThan(2).getPasses()).to.beFalse();
    });

    it('should not pass if the number is less than the given number', () => {
      assert(Validate.number(2).to.beGreaterThan(3).getPasses()).to.beFalse();
    });
  });

  describe('toNot.beGreaterThan', () => {
    it('should not pass if the number is greater than the given number', () => {
      assert(Validate.number(2).toNot.beGreaterThan(1).getPasses()).to.beFalse();
    });

    it('should pass if the number is equal to the given number', () => {
      assert(Validate.number(2).toNot.beGreaterThan(2).getPasses()).to.beTrue();
    });

    it('should pass if the number is less than the given number', () => {
      assert(Validate.number(2).toNot.beGreaterThan(3).getPasses()).to.beTrue();
    });
  });

  describe('to.beGreaterThanOrEqualTo', () => {
    it('should pass if the number is greater than the given number', () => {
      assert(Validate.number(2).to.beGreaterThanOrEqualTo(1).getPasses()).to.beTrue();
    });

    it('should pass if the number is equal to the given number', () => {
      assert(Validate.number(2).to.beGreaterThanOrEqualTo(2).getPasses()).to.beTrue();
    });

    it('should not pass if the number is less than the given number', () => {
      assert(Validate.number(2).to.beGreaterThanOrEqualTo(3).getPasses()).to.beFalse();
    });
  });

  describe('toNot.beGreaterThanOrEqualTo', () => {
    it('should not pass if the number is greater than the given number', () => {
      assert(Validate.number(2).toNot.beGreaterThanOrEqualTo(1).getPasses()).to.beFalse();
    });

    it('should not pass if the number is equal to the given number', () => {
      assert(Validate.number(2).toNot.beGreaterThanOrEqualTo(2).getPasses()).to.beFalse();
    });

    it('should pass if the number is less than the given number', () => {
      assert(Validate.number(2).toNot.beGreaterThanOrEqualTo(3).getPasses()).to.beTrue();
    });
  });

  describe('to.beAnInteger', () => {
    it('should pass if the number is an integer', () => {
      assert(Validate.number(1).to.beAnInteger().getPasses()).to.beTrue();
    });

    it('should not pass if the number is not an integer', () => {
      assert(Validate.number(1.23).to.beAnInteger().getPasses()).to.beFalse();
    });
  });

  describe('toNot.beAnInteger', () => {
    it('should not pass if the number is an integer', () => {
      assert(Validate.number(1).toNot.beAnInteger().getPasses()).to.beFalse();
    });

    it('should pass if the number is not an integer', () => {
      assert(Validate.number(1.23).toNot.beAnInteger().getPasses()).to.beTrue();
    });
  });
});

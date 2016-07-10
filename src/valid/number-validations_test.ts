import {TestBase} from '../test-base';
TestBase.setup();

import {Validate} from './validate';


describe('valid.NumberValidations', () => {
  describe('to.beGreaterThan', () => {
    it('should pass if the number is greater than the given number', () => {
      expect(Validate.number(2).to.beGreaterThan(1).passes).toEqual(true);
    });

    it('should not pass if the number is equal to the given number', () => {
      expect(Validate.number(2).to.beGreaterThan(2).passes).toEqual(false);
    });

    it('should not pass if the number is less than the given number', () => {
      expect(Validate.number(2).to.beGreaterThan(3).passes).toEqual(false);
    });
  });

  describe('toNot.beGreaterThan', () => {
    it('should not pass if the number is greater than the given number', () => {
      expect(Validate.number(2).toNot.beGreaterThan(1).passes).toEqual(false);
    });

    it('should pass if the number is equal to the given number', () => {
      expect(Validate.number(2).toNot.beGreaterThan(2).passes).toEqual(true);
    });

    it('should pass if the number is less than the given number', () => {
      expect(Validate.number(2).toNot.beGreaterThan(3).passes).toEqual(true);
    });
  });

  describe('to.beGreaterThanOrEqualTo', () => {
    it('should pass if the number is greater than the given number', () => {
      expect(Validate.number(2).to.beGreaterThanOrEqualTo(1).passes).toEqual(true);
    });

    it('should pass if the number is equal to the given number', () => {
      expect(Validate.number(2).to.beGreaterThanOrEqualTo(2).passes).toEqual(true);
    });

    it('should not pass if the number is less than the given number', () => {
      expect(Validate.number(2).to.beGreaterThanOrEqualTo(3).passes).toEqual(false);
    });
  });

  describe('toNot.beGreaterThanOrEqualTo', () => {
    it('should not pass if the number is greater than the given number', () => {
      expect(Validate.number(2).toNot.beGreaterThanOrEqualTo(1).passes).toEqual(false);
    });

    it('should not pass if the number is equal to the given number', () => {
      expect(Validate.number(2).toNot.beGreaterThanOrEqualTo(2).passes).toEqual(false);
    });

    it('should pass if the number is less than the given number', () => {
      expect(Validate.number(2).toNot.beGreaterThanOrEqualTo(3).passes).toEqual(true);
    });
  });

  describe('to.beAnInteger', () => {
    it('should pass if the number is an integer', () => {
      expect(Validate.number(1).to.beAnInteger().passes).toEqual(true);
    });

    it('should not pass if the number is not an integer', () => {
      expect(Validate.number(1.23).to.beAnInteger().passes).toEqual(false);
    });
  });

  describe('toNot.beAnInteger', () => {
    it('should not pass if the number is an integer', () => {
      expect(Validate.number(1).toNot.beAnInteger().passes).toEqual(false);
    });

    it('should pass if the number is not an integer', () => {
      expect(Validate.number(1.23).toNot.beAnInteger().passes).toEqual(true);
    });
  });
});

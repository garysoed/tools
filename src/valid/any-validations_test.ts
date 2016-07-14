import {TestBase} from '../test-base';
TestBase.setup();

import {Validate} from './validate';


describe('valid.AnyValidations', () => {
  describe('to.beDefined', () => {
    it('should pass if the value is defined', () => {
      let result = Validate.any('defined').to.beDefined();
      expect(result.passes).toEqual(true);
    });

    it('should pass if the value is null', () => {
      let result = Validate.any(null).to.beDefined();
      expect(result.passes).toEqual(true);
    });

    it('should not pass if the value is undefined', () => {
      let result = Validate.any(undefined).to.beDefined();
      expect(result.passes).toEqual(false);
      expect(result.errorMessage).toEqual(jasmine.stringMatching(/to be defined/));
    });
  });

  describe('toNot.beDefined', () => {
    it('should not pass if the value is defined', () => {
      let result = Validate.any('defined').toNot.beDefined();
      expect(result.passes).toEqual(false);
      expect(result.errorMessage).toEqual(jasmine.stringMatching(/to not be defined/));
    });

    it('should not pass if the value is null', () => {
      let result = Validate.any(null).toNot.beDefined();
      expect(result.passes).toEqual(false);
      expect(result.errorMessage).toEqual(jasmine.stringMatching(/to not be defined/));
    });

    it('should pass if the value is undefined', () => {
      let result = Validate.any(undefined).toNot.beDefined();
      expect(result.passes).toEqual(true);
    });
  });

  describe('to.beEqualTo', () => {
    it('should pass if the value is equal to the reference value', () => {
      let result = Validate.any(1).to.beEqualTo(1);
      expect(result.passes).toEqual(true);
    });

    it('should not pass if the value is not equal to the reference value', () => {
      let result = Validate.any(1).to.beEqualTo(2);
      expect(result.passes).toEqual(false);
      expect(result.errorMessage).toEqual(jasmine.stringMatching(/to be equal to 2/));
    });
  });

  describe('toNot.beEqual', () => {
    it('should pass if the value is not equal to the reference value', () => {
      let result = Validate.any(1).toNot.beEqualTo(2);
      expect(result.passes).toEqual(true);
    });

    it('should not pass if the value is equal to the reference value', () => {
      let result = Validate.any(1).toNot.beEqualTo(1);
      expect(result.passes).toEqual(false);
      expect(result.errorMessage).toEqual(jasmine.stringMatching(/to not be equal to 1/));
    });
  });

  describe('to.exist', () => {
    it('should pass if the value is not null or undefined', () => {
      let result = Validate.any(1).to.exist();
      expect(result.passes).toEqual(true);
    });

    it('should not pass if the value is null', () => {
      let result = Validate.any(null).to.exist();
      expect(result.passes).toEqual(false);
    });

    it('should not pass if the value is undefined', () => {
      let result = Validate.any(undefined).to.exist();
      expect(result.passes).toEqual(false);
    });
  });

  describe('toNot.exist', () => {
    it('should not pass if the value is not null or undefined', () => {
      let result = Validate.any(1).toNot.exist();
      expect(result.passes).toEqual(false);
    });

    it('should pass if the value is null', () => {
      let result = Validate.any(null).toNot.exist();
      expect(result.passes).toEqual(true);
    });

    it('should pass if the value is undefined', () => {
      let result = Validate.any(undefined).toNot.exist();
      expect(result.passes).toEqual(true);
    });
  });
});

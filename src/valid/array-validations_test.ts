import TestBase from '../test-base';
TestBase.setup();

import {Validate} from './validate';


describe('valid.ArrayValidations', () => {
  describe('to.beEmpty', () => {
    it('should pass if the array is empty', () => {
      let result = Validate.array([]).to.beEmpty();
      expect(result.passes).toEqual(true);
    });

    it('should not pass if the array is not empty', () => {
      let result = Validate.array([1, 2, 3]).to.beEmpty();
      expect(result.passes).toEqual(false);
      expect(result.errorMessage).toEqual(jasmine.stringMatching(/to be empty/));
    });
  });

  describe('toNot.beEmpty', () => {
    it('should not pass if the array is empty', () => {
      let result = Validate.array([]).toNot.beEmpty();
      expect(result.passes).toEqual(false);
      expect(result.errorMessage).toEqual(jasmine.stringMatching(/to not be empty/));
    });

    it('should pass if the array is not empty', () => {
      let result = Validate.array([1, 2, 3]).toNot.beEmpty();
      expect(result.passes).toEqual(true);
    });
  });

  describe('to.contain', () => {
    it('should pass if the element is in the array', () => {
      let result = Validate.array([1, 2, 3]).to.contain(2);
      expect(result.passes).toEqual(true);
    });

    it('should not pass if the element is not in the array', () => {
      let result = Validate.array([1, 2, 3]).to.contain(5);
      expect(result.passes).toEqual(false);
      expect(result.errorMessage).toEqual(jasmine.stringMatching(/to contain 5/));
    });
  });

  describe('toNot.contain', () => {
    it('should not pass if the element is in the array', () => {
      let result = Validate.array([1, 2, 3]).toNot.contain(2);
      expect(result.passes).toEqual(false);
      expect(result.errorMessage).toEqual(jasmine.stringMatching(/to not contain 2/));
    });

    it('should pass if the element is not in the array', () => {
      let result = Validate.array([1, 2, 3]).toNot.contain(5);
      expect(result.passes).toEqual(true);
    });
  });
});

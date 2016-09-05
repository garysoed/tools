import {assert, TestBase} from '../test-base';
TestBase.setup();

import {Validate} from './validate';


describe('valid.ArrayValidations', () => {
  describe('to.beEmpty', () => {
    it('should pass if the array is empty', () => {
      let result = Validate.array([]).to.beEmpty();
      assert(result.passes).to.beTrue();
    });

    it('should not pass if the array is not empty', () => {
      let result = Validate.array([1, 2, 3]).to.beEmpty();
      assert(result.passes).to.beFalse();
      assert(result.errorMessage).to.match(/to be empty/);
    });
  });

  describe('toNot.beEmpty', () => {
    it('should not pass if the array is empty', () => {
      let result = Validate.array([]).toNot.beEmpty();
      assert(result.passes).to.beFalse();
      assert(result.errorMessage).to.match(/to not be empty/);
    });

    it('should pass if the array is not empty', () => {
      let result = Validate.array([1, 2, 3]).toNot.beEmpty();
      assert(result.passes).to.beTrue();
    });
  });

  describe('to.contain', () => {
    it('should pass if the element is in the array', () => {
      let result = Validate.array([1, 2, 3]).to.contain(2);
      assert(result.passes).to.beTrue();
    });

    it('should not pass if the element is not in the array', () => {
      let result = Validate.array([1, 2, 3]).to.contain(5);
      assert(result.passes).to.beFalse();
      assert(result.errorMessage).to.match(/to contain 5/);
    });
  });

  describe('toNot.contain', () => {
    it('should not pass if the element is in the array', () => {
      let result = Validate.array([1, 2, 3]).toNot.contain(2);
      assert(result.passes).to.beFalse();
      assert(result.errorMessage).to.match(/to not contain 2/);
    });

    it('should pass if the element is not in the array', () => {
      let result = Validate.array([1, 2, 3]).toNot.contain(5);
      assert(result.passes).to.beTrue();
    });
  });
});

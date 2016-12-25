import {assert, TestBase} from '../test-base';
TestBase.setup();

import {Validate} from './validate';


describe('valid.StringValidations', () => {
  describe('to.beEmpty', () => {
    it('should pass if the string is empty', () => {
      let result = Validate.string('').to.beEmpty();
      assert(result.isValid()).to.beTrue();
    });

    it('should not pass if the string is not empty', () => {
      let result = Validate.string('not empty').to.beEmpty();
      assert(result.isValid()).to.beFalse();
      assert(result.getErrorMessage()).to.match(/to be empty/);
    });
  });

  describe('toNot.beEmpty', () => {
    it('should pass if the string is not empty', () => {
      let result = Validate.string('not empty').toNot.beEmpty();
      assert(result.isValid()).to.beTrue();
    });

    it('should not pass if the string is empty', () => {
      let result = Validate.string('').toNot.beEmpty();
      assert(result.isValid()).to.beFalse();
      assert(result.getErrorMessage()).to.match(/to not be empty/);
    });
  });
});

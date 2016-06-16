import TestBase from '../test-base';
TestBase.setup();

import {Validate} from './validate';


describe('valid.StringValidations', () => {
  describe('to.beEmpty', () => {
    it('should pass if the string is empty', () => {
      let result = Validate.string('').to.beEmpty();
      expect(result.passes).toEqual(true);
    });

    it('should not pass if the string is not empty', () => {
      let result = Validate.string('not empty').to.beEmpty();
      expect(result.passes).toEqual(false);
      expect(result.errorMessage).toEqual(jasmine.stringMatching(/to be empty/));
    });
  });

  describe('toNot.beEmpty', () => {
    it('should pass if the string is not empty', () => {
      let result = Validate.string('not empty').toNot.beEmpty();
      expect(result.passes).toEqual(true);
    });

    it('should not pass if the string is empty', () => {
      let result = Validate.string('').toNot.beEmpty();
      expect(result.passes).toEqual(false);
      expect(result.errorMessage).toEqual(jasmine.stringMatching(/to not be empty/));
    });
  });
});

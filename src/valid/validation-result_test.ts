import {assert, TestBase} from '../test-base';
TestBase.setup();

import {ValidationResult} from './validation-result';


describe('valid.ValidationResult', () => {
  describe('assertValid', () => {
    it('should be noop if the validation passed', () => {
      let result = new ValidationResult(true, 'errorMessage', 'value');
      assert(() => {
        result.assertValid();
      }).toNot.throw();
    });

    it('should throw error if the validation did not pass', () => {
      let errorMessage = 'errorMessage';
      let result = new ValidationResult(false, errorMessage, 'value');
      assert(() => {
        result.assertValid();
      }).to.throwError(new RegExp(errorMessage));
    });
  });

  describe('errorMessage', () => {
    it('should return null if the validation passed', () => {
      let result = new ValidationResult(true, 'errorMessage', 'value');
      assert(result.errorMessage).to.beNull();
    });

    it('should return the error message if the validation did not pass', () => {
      let errorMessage = 'errorMessage';
      let result = new ValidationResult(false, errorMessage, 'value');
      assert(result.errorMessage).to.equal(errorMessage);
    });
  });

  describe('orThrows', () => {
    it('should return a new result with the error message overridden', () => {
      let newErrorMessage = 'newErrorMessage';
      let result = new ValidationResult(false, 'oldErrorMessage', 'value');
      let newResult = result.orThrows(newErrorMessage);

      assert(newResult.errorMessage).to.equal(newErrorMessage);
      assert(newResult.passes).to.beFalse();
      assert(newResult.value).to.equal('value');
    });

    it('should substitute "${value}" with the value being tested', () => {
      let result = new ValidationResult(false, 'oldErrorMessage', 'value');
      let newResult = result.orThrows('value: ${value}');

      assert(newResult.errorMessage).to.equal('value: "value"');
      assert(newResult.passes).to.beFalse();
      assert(newResult.value).to.equal('value');
    });
  });
});

import TestBase from '../test-base';
TestBase.setup();

import {ValidationResult} from './validation-result';


describe('valid.ValidationResult', () => {
  describe('assertValid', () => {
    it('should be noop if the validation passed', () => {
      let result = new ValidationResult(true, 'errorMessage', 'value');
      expect(() => {
        result.assertValid();
      }).not.toThrow();
    });

    it('should throw error if the validation did not pass', () => {
      let errorMessage = 'errorMessage';
      let result = new ValidationResult(false, errorMessage, 'value');
      expect(() => {
        result.assertValid();
      }).toThrowError(errorMessage);
    });
  });

  describe('errorMessage', () => {
    it('should return null if the validation passed', () => {
      let result = new ValidationResult(true, 'errorMessage', 'value');
      expect(result.errorMessage).toEqual(null);
    });

    it('should return the error message if the validation did not pass', () => {
      let errorMessage = 'errorMessage';
      let result = new ValidationResult(false, errorMessage, 'value');
      expect(result.errorMessage).toEqual(errorMessage);
    });
  });

  describe('orThrows', () => {
    it('should return a new result with the error message overridden', () => {
      let newErrorMessage = 'newErrorMessage';
      let result = new ValidationResult(false, 'oldErrorMessage', 'value');
      let newResult = result.orThrows(newErrorMessage);

      expect(newResult.errorMessage).toEqual(newErrorMessage);
      expect(newResult.passes).toEqual(false);
      expect(newResult.value).toEqual('value');
    });

    it('should substitute "${value}" with the value being tested', () => {
      let result = new ValidationResult(false, 'oldErrorMessage', 'value');
      let newResult = result.orThrows('value: ${value}');

      expect(newResult.errorMessage).toEqual('value: "value"');
      expect(newResult.passes).toEqual(false);
      expect(newResult.value).toEqual('value');
    });
  });
});

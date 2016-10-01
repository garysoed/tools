import {assert, TestBase} from '../test-base';
TestBase.setup();

import {BaseValidations} from './base-validations';


describe('valid.BaseValidations', () => {
  describe('resolve', () => {
    it('should pass the result passes and not reversed', () => {
      let validations = new BaseValidations('value', false /* reversed */);
      let result = validations.resolve(true, 'method');
      assert(result.getPasses()).to.beTrue();
    });

    it('should not pass if the result does not pass and not reversed', () => {
      let method = 'method';
      let value = 'value';
      let validations = new BaseValidations(value, false /* reversed */);
      let result = validations.resolve(false, method);
      assert(result.getPasses()).to.beFalse();
      assert(result.getErrorMessage()).to.match(new RegExp(`\\[\"${value}\"\\] to ${method}`));
    });

    it('should pass if the result does not pass and reversed', () => {
      let validations = new BaseValidations('value', true /* reversed */);
      let result = validations.resolve(false, 'method');
      assert(result.getPasses()).to.beTrue();
    });

    it('should not pass if the result passes and reversed', () => {
      let method = 'method';
      let value = 'value';
      let validations = new BaseValidations(value, true /* reversed */);
      let result = validations.resolve(true, method);
      assert(result.getPasses()).to.beFalse();
      assert(result.getErrorMessage()).to.match(new RegExp(`\\[\"${value}\"\\] to not ${method}`));
    });
  });
});

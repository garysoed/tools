import {assert, TestBase} from 'src/test-base';
TestBase.setup();

import {Validate} from './validate';


// Other test cases are covered in the individual *-validations_test files.
describe('valid.Validate', () => {
  describe('fail', () => {
    it('should throw the correct error', () => {
      let message = 'message';
      assert(() => {
        Validate.fail(message);
      }).to.throwError(new RegExp(message));
    });
  });
});

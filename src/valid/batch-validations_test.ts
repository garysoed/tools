import {assert, TestBase} from '../test-base';
TestBase.setup();

import {BatchValidations} from './batch-validations';
import {Mocks} from '../mock/mocks';
import {Validate} from './validate';


describe('valid.BatchValidations', () => {
  /**
   * Creates a mock validation result.
   *
   * @param passes True iff the result passes.
   * @return The mock validation result.
   */
  function createMockValidationResult(passes: boolean): any {
    let mockValidationResult = Mocks.object('ValidationResult');
    mockValidationResult.passes = passes;
    return mockValidationResult;
  }

  describe('getMessage_', () => {
    it('should return the correct message', () => {
      let message1 = 'message1';
      let message2 = 'message2';
      let result1 = createMockValidationResult(false);
      result1.errorMessage = message1;

      let result2 = createMockValidationResult(false);
      result2.errorMessage = message2;

      assert(Validate.batch({'a': result1, 'b': result2}).to['getMessage_']())
          .to.equal(`{a: ${message1}, b: ${message2}}`);
    });
  });

  describe('to.allBeValid', () => {
    it('should pass if all the results in the batch passes', () => {
      let result = Validate
          .batch({
            'a': createMockValidationResult(true),
            'b': createMockValidationResult(true),
          })
          .to.allBeValid();
      assert(result.passes).to.beTrue();
      assert(result.value).to.equal({});
    });

    it('should not pass if one of the results in the batch fails', () => {
      let errorMessage = 'errorMessage';
      spyOn(BatchValidations.prototype, 'getMessage_').and.returnValue(errorMessage);

      let result = Validate
          .batch({
            'a': createMockValidationResult(true),
            'b': createMockValidationResult(false),
          })
          .to.allBeValid();
      assert(result.passes).to.beFalse();
      assert(result.errorMessage).to.match(new RegExp(`all be valid: ${errorMessage}`));
      assert(result.value).to.equal({'b': jasmine.any(Object)});
    });
  });

  describe('toNot.allBeValid', () => {
    it('should not pass if all the results pass', () => {
      let errorMessage = 'errorMessage';
      spyOn(BatchValidations.prototype, 'getMessage_').and.returnValue(errorMessage);

      let result = Validate
          .batch({
            'a': createMockValidationResult(true),
            'b': createMockValidationResult(true),
          })
          .toNot.allBeValid();
      assert(result.passes).to.beFalse();
      assert(result.errorMessage).to.match(new RegExp(`not all be valid: ${errorMessage}`));
      assert(result.value).to.equal({
        'a': jasmine.any(Object),
        'b': jasmine.any(Object),
      });
    });

    it('should pass if one of the results fails', () => {
      let result = Validate
          .batch({
            'a': createMockValidationResult(true),
            'b': createMockValidationResult(false),
          })
          .toNot.allBeValid();
      assert(result.passes).to.beTrue();
      assert(result.value).to.equal({'a': jasmine.any(Object)});
    });
  });

  describe('to.someBeValid', () => {
    it('should pass if one of the results passes', () => {
      let result = Validate
          .batch({
            'a': createMockValidationResult(true),
            'b': createMockValidationResult(false),
          })
          .to.someBeValid();
      assert(result.passes).to.beTrue();
      assert(result.value).to.equal({'b': jasmine.any(Object)});
    });

    it('should not pass if all of the results fails', () => {
      let errorMessage = 'errorMessage';
      spyOn(BatchValidations.prototype, 'getMessage_').and.returnValue(errorMessage);

      let result = Validate
          .batch({
            'a': createMockValidationResult(false),
            'b': createMockValidationResult(false),
          })
          .to.someBeValid();
      assert(result.passes).to.beFalse();
      assert(result.errorMessage).to.match(new RegExp(`some be valid: ${errorMessage}`));
      assert(result.value).to.equal({
        'a': jasmine.any(Object),
        'b': jasmine.any(Object),
      });
    });
  });

  describe('toNot.someBeValid', () => {
    it('should not pass if one of the results passes', () => {
      let errorMessage = 'errorMessage';
      spyOn(BatchValidations.prototype, 'getMessage_').and.returnValue(errorMessage);

      let result = Validate
          .batch({
            'a': createMockValidationResult(true),
            'b': createMockValidationResult(false),
          })
          .toNot.someBeValid();
      assert(result.passes).to.beFalse();
      assert(result.errorMessage).to.match(new RegExp(`not some be valid: ${errorMessage}`));
      assert(result.value).to.equal({
        'a': jasmine.any(Object),
      });
    });

    it('should pass if all of the results fails', () => {
      let result = Validate
          .batch({
            'a': createMockValidationResult(false),
            'b': createMockValidationResult(false),
          })
          .toNot.someBeValid();
      assert(result.passes).to.beTrue();
      assert(result.value).to.equal({});
    });
  });
});

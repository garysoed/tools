import {TestBase} from '../test-base';
TestBase.setup();

import {Mocks} from '../mock/mocks';
import {VerifyUtil} from './verify-util';


describe('jasmine.VerifyUtil', () => {
  describe('createCheckFunction_', () => {
    let baseFunction;
    let mockExpect;

    beforeEach(() => {
      baseFunction = Mocks.object('baseFunction');
      mockExpect = jasmine.createSpy('Expect');
    });

    it('should return the correct function', () => {
      let mockMatchers = jasmine.createSpyObj('Matchers', ['toHaveBeenCalledWith']);
      mockExpect.and.returnValue(mockMatchers);

      let checkFn = VerifyUtil['createCheckFunction_'](
          baseFunction, false /* reversed */, mockExpect);
      checkFn(1, 2, 3);
      expect(mockMatchers.toHaveBeenCalledWith).toHaveBeenCalledWith(1, 2, 3);
      expect(mockExpect).toHaveBeenCalledWith(baseFunction);
    });

    it('should return the correct function for reversal case', () => {
      let mockMatchers = jasmine.createSpyObj('Matchers', ['toHaveBeenCalledWith']);
      mockExpect.and.returnValue({not: mockMatchers});

      let checkFn = VerifyUtil['createCheckFunction_'](
          baseFunction, true /* reversed */, mockExpect);
      checkFn(1, 2, 3);
      expect(mockMatchers.toHaveBeenCalledWith).toHaveBeenCalledWith(1, 2, 3);
      expect(mockExpect).toHaveBeenCalledWith(baseFunction);
    });
  });

  describe('create', () => {
    it('should create the correct object when object was given', () => {
      let key1 = 'key1';
      let function1 = Mocks.object('function1');
      let checkFunction1 = Mocks.object('checkFunction1');

      let key2 = 'key2';
      let function2 = Mocks.object('function2');
      let checkFunction2 = Mocks.object('checkFunction2');

      spyOn(VerifyUtil, 'createCheckFunction_').and.callFake((baseFunction: any): any => {
        switch (baseFunction) {
          case function1:
            return checkFunction1;
          case function2:
            return checkFunction2;
        }
      });

      let instance = {[key1]: function1, [key2]: function2};
      let reversed = Mocks.object('reversed');

      expect(VerifyUtil.create(instance, reversed)).toEqual({
        [key1]: checkFunction1,
        [key2]: checkFunction2,
      });
      expect(VerifyUtil['createCheckFunction_']).toHaveBeenCalledWith(function1, reversed, expect);
      expect(VerifyUtil['createCheckFunction_']).toHaveBeenCalledWith(function2, reversed, expect);
    });

    it('should create the correct function when function was given', () => {
      let baseFunction = () => undefined;
      let checkFunction = Mocks.object('checkFunction');

      spyOn(VerifyUtil, 'createCheckFunction_').and.returnValue(checkFunction);

      let reversed = Mocks.object('reversed');

      expect(VerifyUtil.create(baseFunction, reversed)).toEqual(checkFunction);
      expect(VerifyUtil['createCheckFunction_'])
          .toHaveBeenCalledWith(baseFunction, reversed, expect);
    });
  });
});

import {TestBase} from '../test-base';
TestBase.setup();

import {FunctionAssert} from './function-assert';
import {Mocks} from '../mock/mocks';


describe('jasmine.FunctionAssert', () => {
  let assert;

  beforeEach(() => {
    assert = new FunctionAssert(
        () => {} /* value */,
        true /* reversed */,
        jasmine.createSpy('expect'));
  });

  describe('throwError', () => {
    it('should call the matchers correctly', () => {
      let mockMatchers = jasmine.createSpyObj('Matchers', ['toThrowError']);
      spyOn(assert, 'getMatchers_').and.returnValue(mockMatchers);

      let regexp = Mocks.object('regexp');
      assert.throwError(regexp);

      expect(mockMatchers.toThrowError).toHaveBeenCalledWith(regexp);
    });
  });
});

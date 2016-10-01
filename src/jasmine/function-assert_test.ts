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

  describe('haveBeenCalled', () => {
    it('should call the matchers correctly', () => {
      let mockMatchers = jasmine.createSpyObj('Matchers', ['toHaveBeenCalled']);
      spyOn(assert, 'getMatchers_').and.returnValue(mockMatchers);

      assert.haveBeenCalled();

      expect(mockMatchers.toHaveBeenCalled).toHaveBeenCalledWith();
    });
  });

  describe('haveBeenCalledWith', () => {
    it('should return a function which calls the matchers correctly', () => {
      let mockMatchers = jasmine.createSpyObj('Matchers', ['toHaveBeenCalledWith']);
      spyOn(assert, 'getMatchers_').and.returnValue(mockMatchers);

      assert.haveBeenCalledWith(1, 2, 3, 4);

      expect(mockMatchers.toHaveBeenCalledWith).toHaveBeenCalledWith(1, 2, 3, 4);
    });
  });

  describe('throw', () => {
    it('should call the matchers correctly', () => {
      let mockMatchers = jasmine.createSpyObj('Matchers', ['toThrow']);
      spyOn(assert, 'getMatchers_').and.returnValue(mockMatchers);

      assert.throw();

      expect(mockMatchers.toThrow).toHaveBeenCalledWith();
    });
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

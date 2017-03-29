import { TestBase } from '../test-base';
TestBase.setup();

import { Mocks } from '../mock/mocks';

import { FunctionAssert } from './function-assert';


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

  describe('haveBeenCalled', () => {
    it('should call the matchers correctly', () => {
      let mockMatchers = jasmine.createSpyObj('Matchers', ['toHaveBeenCalledTimes']);
      spyOn(assert, 'getMatchers_').and.returnValue(mockMatchers);

      assert.haveBeenCalledTimes(123);

      expect(mockMatchers.toHaveBeenCalledTimes).toHaveBeenCalledWith(123);
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

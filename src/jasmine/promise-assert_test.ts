import { TestBase } from '../test-base';
TestBase.setup();

import { PromiseAssert } from '../jasmine/promise-assert';
import { Fakes } from '../mock/fakes';
import { Mocks } from '../mock/mocks';


describe('jasmine.PromiseAssert', () => {
  let mockExpect: any;
  let mockFail: any;

  beforeEach(() => {
    mockExpect = jasmine.createSpy('Expect');
    mockFail = jasmine.createSpy('Fail');
  });

  describe('ctor', () => {
    it('should not throw error if reversed is false', () => {
      expect(() => {
        new PromiseAssert<string>(Promise.resolve('value'), mockFail, false, mockExpect);
      }).not.toThrow();
    });

    it('should throw error if reversed is true', () => {
      expect(() => {
        new PromiseAssert<string>(Promise.resolve('value'), mockFail, true, mockExpect);
      }).toThrowError(/not supported/);
    });
  });

  describe('resolveWith', () => {
    it('should call the matcher correctly', async () => {
      const value = 'value';
      const mockMatchers = jasmine.createSpyObj('Matchers', ['toEqual']);
      spyOn(PromiseAssert.prototype, 'getMatchers_').and.returnValue(mockMatchers);

      const assert = new PromiseAssert<string>(Promise.resolve(value), mockFail, false, mockExpect);
      const returnedValue = await assert.resolveWith(value);
      expect(returnedValue).toEqual(value);
      expect(mockMatchers.toEqual).toHaveBeenCalledWith(value);
      expect(assert['getMatchers_']).toHaveBeenCalledWith(value);
    });
  });

  describe('reject', () => {
    it('should fail if the promise resolves', async () => {
      const assert = new PromiseAssert<string>(
          Promise.resolve('value'), mockFail, false, mockExpect);
      await assert.reject();
      expect(mockFail).toHaveBeenCalledWith('Expected to reject');
    });

    it('should not fail if the promise rejects', async () => {
      const error = Mocks.object('error');
      const assert = new PromiseAssert<string>(
          Promise.reject(error), mockFail, false, mockExpect);
      const actualError = await assert.reject();
      expect(actualError).toEqual(error);
      expect(mockFail).not.toHaveBeenCalled();
    });
  });

  describe('rejectWithErrorType', () => {
    it('should call the matcher correctly', async () => {
      const errorType = Mocks.object('errorType');
      const errorRegexp = Mocks.object('errorRegexp');

      const message = 'message';
      const error = Mocks.object('error');
      error.message = message;

      const mockMatchersMessage = jasmine.createSpyObj('MatchersMessage', ['toMatch']);
      const mockMatchersType = jasmine.createSpyObj('MatchersType', ['toEqual']);
      Fakes.build(spyOn(PromiseAssert.prototype, 'getMatchers_'))
          .when(message).return(mockMatchersMessage)
          .when(error).return(mockMatchersType);

      const jasmineAny = Mocks.object('jasmineAny');
      spyOn(jasmine, 'any').and.returnValue(jasmineAny);

      const assert = new PromiseAssert<string>(
          Promise.reject(error), mockFail, false, mockExpect);
      const actualError = await assert.rejectWithErrorType(errorType, errorRegexp);
      expect(actualError).toEqual(error);
      expect(mockMatchersMessage.toMatch).toHaveBeenCalledWith(errorRegexp);
      expect(assert['getMatchers_']).toHaveBeenCalledWith(message);
      expect(mockMatchersType.toEqual).toHaveBeenCalledWith(jasmineAny);
      expect(jasmine.any).toHaveBeenCalledWith(errorType);
      expect(mockFail).not.toHaveBeenCalled();
    });

    it('should fail if the promise resolves', async () => {
      const assert = new PromiseAssert<string>(Promise.resolve(''), mockFail, false, mockExpect);
      await assert.rejectWithErrorType(Mocks.object('errorType'), Mocks.object('errorRegexp'));
      expect(mockFail).toHaveBeenCalledWith(jasmine.stringMatching(/Expected to reject/));
    });
  });

  describe('rejectWithError', () => {
    it('should call the matcher correctly', async () => {
      const errorRegexp = Mocks.object('errorRegexp');

      const message = 'message';
      const error = Mocks.object('error');
      error.message = message;

      const mockMatchersMessage = jasmine.createSpyObj('MatchersMessage', ['toMatch']);
      const mockMatchersType = jasmine.createSpyObj('MatchersType', ['toEqual']);
      Fakes.build(spyOn(PromiseAssert.prototype, 'getMatchers_'))
          .when(message).return(mockMatchersMessage)
          .when(error).return(mockMatchersType);

      const jasmineAny = Mocks.object('jasmineAny');
      spyOn(jasmine, 'any').and.returnValue(jasmineAny);

      const assert = new PromiseAssert<string>(
          Promise.reject(error), mockFail, false, mockExpect);
      const actualError = await assert.rejectWithError(errorRegexp);
      expect(actualError).toEqual(error);
      expect(mockMatchersMessage.toMatch).toHaveBeenCalledWith(errorRegexp);
      expect(assert['getMatchers_']).toHaveBeenCalledWith(message);
      expect(mockMatchersType.toEqual).toHaveBeenCalledWith(jasmineAny);
      expect(jasmine.any).toHaveBeenCalledWith(Error);
      expect(mockFail).not.toHaveBeenCalled();
    });

    it('should fail if the promise resolves', async () => {
      const assert = new PromiseAssert<string>(Promise.resolve(''), mockFail, false, mockExpect);
      await assert.rejectWithError(Mocks.object('errorRegexp'));
      expect(mockFail).toHaveBeenCalledWith(jasmine.stringMatching(/Expected to reject/));
    });
  });
});

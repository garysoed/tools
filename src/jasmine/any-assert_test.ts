import {TestBase} from '../test-base';
TestBase.setup();

import {Mocks} from '../mock/mocks';

import {AnyAssert} from './any-assert';


describe('jasmine.AnyAssert', () => {
  let mockExpect;
  let value;
  let assert;

  beforeEach(() => {
    mockExpect = jasmine.createSpy('Expect');
    value = Mocks.object('value');
    assert = new AnyAssert(value, true /* reversed */, mockExpect);
  });

  describe('be', () => {
    it('should call the matcher correctly', () => {
      let other = Mocks.object('other');
      let mockMatchers = jasmine.createSpyObj('Matcher', ['toBe']);
      spyOn(assert, 'getMatchers_').and.returnValue(mockMatchers);

      assert.be(other);

      expect(mockMatchers.toBe).toHaveBeenCalledWith(other);
    });
  });

  describe('beAnInstanceOf', () => {
    it('should call the matcher correctly', () => {
      let clazz = Mocks.object('clazz');
      let anyMatcher = Mocks.object('any');
      spyOn(jasmine, 'any').and.returnValue(anyMatcher);

      let mockMatchers = jasmine.createSpyObj('Matcher', ['toEqual']);
      spyOn(assert, 'getMatchers_').and.returnValue(mockMatchers);

      assert.beAnInstanceOf(clazz);

      expect(mockMatchers.toEqual).toHaveBeenCalledWith(anyMatcher);
      expect(jasmine.any).toHaveBeenCalledWith(clazz);
    });
  });

  describe('beDefined', () => {
    it('should call the matcher correctly', () => {
      let mockMatchers = jasmine.createSpyObj('Matcher', ['toBeDefined']);
      spyOn(assert, 'getMatchers_').and.returnValue(mockMatchers);

      assert.beDefined();

      expect(mockMatchers.toBeDefined).toHaveBeenCalledWith();
    });
  });

  describe('beFalsy', () => {
    it('should call the matcher correctly', () => {
      let mockMatchers = jasmine.createSpyObj('Matcher', ['toBeFalsy']);
      spyOn(assert, 'getMatchers_').and.returnValue(mockMatchers);

      assert.beFalsy();

      expect(mockMatchers.toBeFalsy).toHaveBeenCalledWith();
    });
  });

  describe('beNull', () => {
    it('should call the matcher correctly', () => {
      let mockMatchers = jasmine.createSpyObj('Matcher', ['toBeNull']);
      spyOn(assert, 'getMatchers_').and.returnValue(mockMatchers);

      assert.beNull();

      expect(mockMatchers.toBeNull).toHaveBeenCalledWith();
    });
  });

  describe('beTruthy', () => {
    it('should call the matcher correctly', () => {
      let mockMatchers = jasmine.createSpyObj('Matcher', ['toBeTruthy']);
      spyOn(assert, 'getMatchers_').and.returnValue(mockMatchers);

      assert.beTruthy();

      expect(mockMatchers.toBeTruthy).toHaveBeenCalledWith();
    });
  });

  describe('equal', () => {
    it('should call the matcher correctly', () => {
      let other = Mocks.object('other');
      let mockMatchers = jasmine.createSpyObj('Matcher', ['toEqual']);
      spyOn(assert, 'getMatchers_').and.returnValue(mockMatchers);

      assert.equal(other);

      expect(mockMatchers.toEqual).toHaveBeenCalledWith(other);
    });
  });
});

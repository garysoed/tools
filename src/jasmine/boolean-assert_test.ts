import { TestBase } from '../test-base';
TestBase.setup();

import { BooleanAssert } from './boolean-assert';


describe('jasmine.BooleanAssert', () => {
  let assert: BooleanAssert;

  beforeEach(() => {
    assert = new BooleanAssert(true /* value */, true /* reversed */, jasmine.createSpy('expect'));
  });

  describe('beFalse', () => {
    it('should call the matchers correctly', () => {
      const mockMatchers = jasmine.createSpyObj('Matcher', ['toBe']);
      spyOn(assert, 'getMatchers_').and.returnValue(mockMatchers);

      assert.beFalse();

      expect(mockMatchers.toBe).toHaveBeenCalledWith(false);
    });
  });

  describe('beTrue', () => {
    it('should call the matchers correctly', () => {
      const mockMatchers = jasmine.createSpyObj('Matcher', ['toBe']);
      spyOn(assert, 'getMatchers_').and.returnValue(mockMatchers);

      assert.beTrue();

      expect(mockMatchers.toBe).toHaveBeenCalledWith(true);
    });
  });
});

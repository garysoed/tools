import { TestBase } from '../test-base';
TestBase.setup();

import { NumberAssert } from './number-assert';


describe('jasmine.NumberAssert', () => {
  let assert;

  beforeEach(() => {
    assert = new NumberAssert(true /* value */, false /* reversed */, jasmine.createSpy('expect'));
  });

  describe('beCloseTo', () => {
    it('should call the matchers correctly', () => {
      const target = 123;
      const precision = 456;
      const mockMatchers = jasmine.createSpyObj('Matcher', ['toBeCloseTo']);
      spyOn(assert, 'getMatchers_').and.returnValue(mockMatchers);

      assert.beCloseTo(target, precision);

      expect(mockMatchers.toBeCloseTo).toHaveBeenCalledWith(target, precision);

    });
  });
});

import {TestBase} from '../test-base';
TestBase.setup();

import {NumberAssert} from './number-assert';


describe('jasmine.NumberAssert', () => {
  let assert;

  beforeEach(() => {
    assert = new NumberAssert(true /* value */, false /* reversed */, jasmine.createSpy('expect'));
  });

  describe('beCloseTo', () => {
    fit('should call the matchers correctly', () => {
      let target = 123;
      let precision = 456;
      let mockMatchers = jasmine.createSpyObj('Matcher', ['toBeCloseTo']);
      spyOn(assert, 'getMatchers_').and.returnValue(mockMatchers);

      assert.beCloseTo(target, precision);

      expect(mockMatchers.toBeCloseTo).toHaveBeenCalledWith(target, precision);

    });
  });
});

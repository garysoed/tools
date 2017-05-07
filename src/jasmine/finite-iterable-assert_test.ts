import { TestBase } from '../test-base';
TestBase.setup();

import { FiniteIterableAssert } from '../jasmine/finite-iterable-assert';


describe('jasmine.FiniteIterableAssert', () => {
  describe('haveElements', () => {
    it('should call the matcher correctly', () => {
      const elements = [1, 2, 3];
      const set: any = new Set(elements);

      const assert = new FiniteIterableAssert<number>(set, false, jasmine.createSpy('Expect'));
      const mockMatcher = jasmine.createSpyObj('Matcher', ['toEqual']);
      spyOn(assert, 'getMatchers_').and.returnValue(mockMatcher);

      const expectedElements = [1, 2, 3, 4];

      assert.haveElements(expectedElements);

      expect(mockMatcher.toEqual).toHaveBeenCalledWith(expectedElements);
      expect(assert['getMatchers_']).toHaveBeenCalledWith(elements);
    });
  });
});

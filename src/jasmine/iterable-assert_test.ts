import { TestBase } from '../test-base';
TestBase.setup();

import { IterableAssert } from '../jasmine/iterable-assert';


describe('jasmine.IterableAssert', () => {
  describe('startWith', () => {
    it('should call the matcher correctly', () => {
      function* gen(): IterableIterator<number> {
        while (true) {
          yield 1;
        }
      }
      const assert = new IterableAssert<number>(gen(), true, jasmine.createSpy('expect'));
      const mockMatchers = jasmine.createSpyObj('Matchers', ['toEqual']);
      spyOn(assert, 'getMatchers_').and.returnValue(mockMatchers);

      const expected = [0, 1, 2, 3];
      assert.startWith(expected);
      expect(mockMatchers.toEqual).toHaveBeenCalledWith(expected);
      expect(assert['getMatchers_']).toHaveBeenCalledWith([1, 1, 1, 1]);
    });
  });
});

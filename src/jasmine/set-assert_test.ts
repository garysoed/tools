import { TestBase } from '../test-base';
TestBase.setup();

import { Mocks } from '../mock/mocks';

import { SetAssert } from './set-assert';


describe('jasmine.SetAssert', () => {
  let set: Set<string>;
  let assert: SetAssert<string>;

  beforeEach(() => {
    set = new Set();
    assert = new SetAssert<string>(set, false /* reversed */, jasmine.createSpy('Expect'));
  });

  describe('haveElements', () => {
    it('should call the matcher correctly', () => {
      const element1 = 'element1';
      set.add(element1);

      const element2 = 'element2';
      set.add(element2);

      const mockMatcher = jasmine.createSpyObj('Matcher', ['toEqual']);
      spyOn(assert, 'getMatchers_').and.returnValue(mockMatcher);
      const elements = Mocks.object('elements');

      assert.haveElements(elements);

      expect(mockMatcher.toEqual).toHaveBeenCalledWith(elements);
      expect(assert['getMatchers_']).toHaveBeenCalledWith([element1, element2]);
    });
  });
});

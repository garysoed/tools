import {TestBase} from 'src/test-base';
TestBase.setup();

import {Mocks} from 'src/mock/mocks';

import {SetAssert} from './set-assert';


describe('jasmine.SetAssert', () => {
  let set: Set<string>;
  let mockExpect;
  let assert: SetAssert<string>;

  beforeEach(() => {
    mockExpect = jasmine.createSpy('Expect');
    set = new Set();
    assert = new SetAssert<string>(set, false /* reversed */, mockExpect);
  });

  describe('haveElements', () => {
    it('should call the matcher correctly', () => {
      let element1 = 'element1';
      set.add(element1);

      let element2 = 'element2';
      set.add(element2);

      let mockMatcher = jasmine.createSpyObj('Matcher', ['toEqual']);
      mockExpect.and.returnValue(mockMatcher);

      let elements = Mocks.object('elements');

      assert['reversed_'] = false;
      assert.haveElements(elements);

      expect(mockMatcher.toEqual).toHaveBeenCalledWith(elements);
      expect(mockExpect).toHaveBeenCalledWith([element1, element2]);
    });

    it('should call the matcher correctly when reversed', () => {
      let element1 = 'element1';
      set.add(element1);

      let element2 = 'element2';
      set.add(element2);

      let mockMatcher = jasmine.createSpyObj('Matcher', ['toEqual']);
      mockExpect.and.returnValue({not: mockMatcher});

      let entries = Mocks.object('entries');

      assert['reversed_'] = true;
      assert.haveElements(entries);

      expect(mockMatcher.toEqual).toHaveBeenCalledWith(entries);
      expect(mockExpect).toHaveBeenCalledWith([element1, element2]);
    });
  });
});

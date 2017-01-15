import {TestBase} from '../test-base';
TestBase.setup();

import {Mocks} from '../mock/mocks';

import {ElementAssert} from './element-assert';


describe('jasmine.ElementAssert', () => {
  let mockExpect;
  let parentEl;
  let assert;

  beforeEach(() => {
    mockExpect = jasmine.createSpy('Expect');
    parentEl = document.createElement('div');
    assert = new ElementAssert(
        parentEl,
        false /* reversed */,
        mockExpect);
  });

  describe('haveChildren', () => {
    it('should call the matchers correctly', () => {
      let mockMatcher = jasmine.createSpyObj('Matcher', ['toEqual']);
      mockExpect.and.returnValue(mockMatcher);

      let child1 = document.createElement('div');
      let child2 = document.createElement('div');
      parentEl.appendChild(child1);
      parentEl.appendChild(child2);

      let expectedChildren = Mocks.object('expectedChildren');

      assert.haveChildren(expectedChildren);

      expect(mockMatcher.toEqual).toHaveBeenCalledWith(expectedChildren);
      expect(mockExpect).toHaveBeenCalledWith([child1, child2]);
    });

    it('should call the matchers correctly when reversed', () => {
      let mockMatcher = jasmine.createSpyObj('Matcher', ['toEqual']);
      mockExpect.and.returnValue({not: mockMatcher});

      let child1 = document.createElement('div');
      let child2 = document.createElement('div');
      parentEl.appendChild(child1);
      parentEl.appendChild(child2);

      let expectedChildren = Mocks.object('expectedChildren');

      assert['reversed_'] = true;
      assert.haveChildren(expectedChildren);

      expect(mockMatcher.toEqual).toHaveBeenCalledWith(expectedChildren);
      expect(mockExpect).toHaveBeenCalledWith([child1, child2]);
    });
  });
});

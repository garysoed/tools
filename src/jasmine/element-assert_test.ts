import { TestBase } from '../test-base';
TestBase.setup();

import { Mocks } from '../mock/mocks';

import { ElementAssert } from './element-assert';


describe('jasmine.ElementAssert', () => {
  let mockExpect: any;
  let element: HTMLElement;
  let assert: ElementAssert;

  beforeEach(() => {
    mockExpect = jasmine.createSpy('Expect');
    element = document.createElement('div');
    assert = new ElementAssert(
        element,
        false /* reversed */,
        mockExpect);
  });

  describe('haveChildren', () => {
    it('should call the matchers correctly', () => {
      const mockMatcher = jasmine.createSpyObj('Matcher', ['toEqual']);
      mockExpect.and.returnValue(mockMatcher);

      const child1 = document.createElement('div');
      const child2 = document.createElement('div');
      element.appendChild(child1);
      element.appendChild(child2);

      const expectedChildren = Mocks.object('expectedChildren');

      assert.haveChildren(expectedChildren);

      expect(mockMatcher.toEqual).toHaveBeenCalledWith(expectedChildren);
      expect(mockExpect).toHaveBeenCalledWith([child1, child2]);
    });

    it('should call the matchers correctly when reversed', () => {
      const mockMatcher = jasmine.createSpyObj('Matcher', ['toEqual']);
      mockExpect.and.returnValue({not: mockMatcher});

      const child1 = document.createElement('div');
      const child2 = document.createElement('div');
      element.appendChild(child1);
      element.appendChild(child2);

      const expectedChildren = Mocks.object('expectedChildren');

      (assert as any)['reversed_'] = true;
      assert.haveChildren(expectedChildren);

      expect(mockMatcher.toEqual).toHaveBeenCalledWith(expectedChildren);
      expect(mockExpect).toHaveBeenCalledWith([child1, child2]);
    });
  });

  describe('haveClasses', () => {
    it('should call the matchers correctly', () => {
      const mockMatcher = jasmine.createSpyObj('Matcher', ['toEqual']);
      mockExpect.and.returnValue(mockMatcher);

      const class1 = 'class1';
      const class2 = 'class2';
      element.classList.add(class1, class2);
      const expectedClasses = Mocks.object('expectedClasses');

      assert.haveClasses(expectedClasses);

      expect(mockMatcher.toEqual).toHaveBeenCalledWith(expectedClasses);
      expect(mockExpect).toHaveBeenCalledWith([class1, class2]);
    });

    it('should call the matchers correctly when reversed', () => {
      const mockMatcher = jasmine.createSpyObj('Matcher', ['toEqual']);
      mockExpect.and.returnValue({not: mockMatcher});

      const class1 = 'class1';
      const class2 = 'class2';
      element.classList.add(class1, class2);

      const expectedClasses = Mocks.object('expectedClasses');

      (assert as any)['reversed_'] = true;
      assert.haveClasses(expectedClasses);

      expect(mockMatcher.toEqual).toHaveBeenCalledWith(expectedClasses);
      expect(mockExpect).toHaveBeenCalledWith([class1, class2]);
    });
  });
});

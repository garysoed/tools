import { TestBase } from '../test-base';
TestBase.setup();

import { Mocks } from '../mock/mocks';

import { BaseAssert } from './base-assert';


describe('jasmine.BaseAssert', () => {
  let mockExpect;

  beforeEach(() => {
    mockExpect = jasmine.createSpy('Expect');
  });

  describe('getMatchers_', () => {
    it('should return the reversed matcher if reversed', () => {
      const not = Mocks.object('not');
      mockExpect.and.returnValue({not: not});

      const value = Mocks.object('value');
      const assert = new BaseAssert(value, true /* reversed */, mockExpect);
      expect(assert['getMatchers_']()).toEqual(not);
    });

    it('should return the matcher if not reversed', () => {
      const matcher = Mocks.object('matcher');
      mockExpect.and.returnValue(matcher);

      const value = Mocks.object('value');
      const assert = new BaseAssert(value, false /* reversed */, mockExpect);
      expect(assert['getMatchers_']()).toEqual(matcher);
    });
  });
});

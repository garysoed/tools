import {TestBase} from '../test-base';
TestBase.setup();

import {Mocks} from '../mock/mocks';

import {BaseAssert} from './base-assert';


describe('jasmine.BaseAssert', () => {
  let mockExpect;

  beforeEach(() => {
    mockExpect = jasmine.createSpy('Expect');
  });

  describe('getMatchers_', () => {
    it('should return the reversed matcher if reversed', () => {
      let not = Mocks.object('not');
      mockExpect.and.returnValue({not: not});

      let value = Mocks.object('value');
      let assert = new BaseAssert(value, true /* reversed */, mockExpect);
      expect(assert['getMatchers_']()).toEqual(not);
    });

    it('should return the matcher if not reversed', () => {
      let matcher = Mocks.object('matcher');
      mockExpect.and.returnValue(matcher);

      let value = Mocks.object('value');
      let assert = new BaseAssert(value, false /* reversed */, mockExpect);
      expect(assert['getMatchers_']()).toEqual(matcher);
    });
  });
});

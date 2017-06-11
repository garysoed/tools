import { TestBase } from '../test-base';
TestBase.setup();

import { Mocks } from '../mock/mocks';

import { ArrayAssert } from './array-assert';


describe('jasmine.ArrayAssert', () => {
  let mockExpect;
  let value;
  let assert: ArrayAssert<any>;

  beforeEach(() => {
    mockExpect = jasmine.createSpy('Expect');
    value = Mocks.object('value');
    assert = new ArrayAssert(value, true /* reversed */, mockExpect);
  });

  describe('contain', () => {
    it('should call the matcher correctly', () => {
      const other = Mocks.object('other');
      const mockMatchers = jasmine.createSpyObj('Matcher', ['toContain']);
      spyOn(assert, 'getMatchers_').and.returnValue(mockMatchers);

      assert.contain(other);

      expect(mockMatchers.toContain).toHaveBeenCalledWith(other);
    });
  });
});

import { TestBase } from '../test-base';
TestBase.setup();

import { Mocks } from '../mock/mocks';

import { StringAssert } from './string-assert';


describe('jasmine.StringAssert', () => {
  let assert;

  beforeEach(() => {
    assert = new StringAssert(
        'string' /* value */,
        true /* reversed */,
        jasmine.createSpy('expect'));
  });

  describe('match', () => {
    it('should call the matchers correctly', () => {
      let regexp = Mocks.object('regexp');
      let stringMatching = Mocks.object('stringMatching');
      spyOn(jasmine, 'stringMatching').and.returnValue(stringMatching);

      let mockMatchers = jasmine.createSpyObj('Matchers', ['toEqual']);
      spyOn(assert, 'getMatchers_').and.returnValue(mockMatchers);

      assert.match(regexp);

      expect(mockMatchers.toEqual).toHaveBeenCalledWith(stringMatching);
      expect(jasmine.stringMatching).toHaveBeenCalledWith(regexp);
    });
  });
});

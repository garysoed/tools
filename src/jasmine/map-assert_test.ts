import { TestBase } from '../test-base';
TestBase.setup();

import { Mocks } from '../mock/mocks';

import { MapAssert } from './map-assert';


describe('jasmine.MapAssert', () => {
  let map: Map<string, string>;
  let assert: MapAssert<string, string>;

  beforeEach(() => {
    map = new Map<string, string>();
    assert = new MapAssert<string, string>(map, false /* reversed */, jasmine.createSpy('Expect'));
  });

  describe('haveEntries', () => {
    it('should call the matcher correctly', () => {
      const key1 = 'key1';
      const value1 = 'value1';
      map.set(key1, value1);

      const key2 = 'key2';
      const value2 = 'value2';
      map.set(key2, value2);

      const mockMatcher = jasmine.createSpyObj('Matcher', ['toEqual']);
      spyOn(assert, 'getMatchers_').and.returnValue(mockMatcher);
      const entries = Mocks.object('entries');

      assert.haveEntries(entries);

      expect(mockMatcher.toEqual).toHaveBeenCalledWith(entries);
      expect(assert['getMatchers_']).toHaveBeenCalledWith([[key1, value1], [key2, value2]]);
    });
  });
});

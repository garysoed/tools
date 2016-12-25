import {TestBase} from '../test-base';
TestBase.setup();

import {Mocks} from '../mock/mocks';

import {MapAssert} from './map-assert';


describe('jasmine.MapAssert', () => {
  let map: Map<string, string>;
  let mockExpect;
  let assert: MapAssert<string, string>;

  beforeEach(() => {
    mockExpect = jasmine.createSpy('Expect');
    map = new Map<string, string>();
    assert = new MapAssert<string, string>(map, false /* reversed */, mockExpect);
  });

  describe('haveEntries', () => {
    it('should call the matcher correctly', () => {
      let key1 = 'key1';
      let value1 = 'value1';
      map.set(key1, value1);

      let key2 = 'key2';
      let value2 = 'value2';
      map.set(key2, value2);

      let mockMatcher = jasmine.createSpyObj('Matcher', ['toEqual']);
      mockExpect.and.returnValue(mockMatcher);

      let entries = Mocks.object('entries');

      assert['reversed_'] = false;
      assert.haveEntries(entries);

      expect(mockMatcher.toEqual).toHaveBeenCalledWith(entries);
      expect(mockExpect).toHaveBeenCalledWith([[key1, value1], [key2, value2]]);
    });

    it('should call the matcher correctly when reversed', () => {
      let key1 = 'key1';
      let value1 = 'value1';
      map.set(key1, value1);

      let key2 = 'key2';
      let value2 = 'value2';
      map.set(key2, value2);

      let mockMatcher = jasmine.createSpyObj('Matcher', ['toEqual']);
      mockExpect.and.returnValue({not: mockMatcher});

      let entries = Mocks.object('entries');

      assert['reversed_'] = true;
      assert.haveEntries(entries);

      expect(mockMatcher.toEqual).toHaveBeenCalledWith(entries);
      expect(mockExpect).toHaveBeenCalledWith([[key1, value1], [key2, value2]]);
    });
  });
});

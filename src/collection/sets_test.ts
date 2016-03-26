import TestBase from '../test-base';
TestBase.setup();

import Sets from './sets';

describe('collection.Sets', () => {
  describe('fromArray', () => {
    it('should return the correct set', () => {
      let set = Sets.fromArray([1, 1, 1, 2, 2]).data;
      expect(set.size).toEqual(2);
      expect(set.has(1)).toEqual(true);
      expect(set.has(2)).toEqual(true);
    });
  });
});

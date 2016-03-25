import TestBase from '../test-base';
TestBase.setup();

import Arrays from './arrays';

describe('collection.Arrays', () => {
  describe('fromNumericalIndexed', () => {
    it('should return the correct array', () => {
      let indexed = <{ [index: number]: string, length: number }> {
        0: 'a',
        1: 'b',
        2: 'c',
        length: 3,
      };

      expect(Arrays.fromNumericalIndexed(indexed).data).toEqual(['a', 'b', 'c']);
    });
  });
});

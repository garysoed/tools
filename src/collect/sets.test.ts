import { assert, should, test } from '@gs-testing';

import { intersect } from './sets';

test('@tools/collect/sets', () => {
  test('intersect', () => {
    should(`create a set containing common entries`, () => {
      assert(intersect(new Set([1, 2, 3]), new Set([2, 3, 4]))).to
          .haveExactElements(new Set([2, 3]));
    });
  });
});

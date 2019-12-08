import { assert, should, test } from '@gs-testing';

import { FluentSet } from './fluent-set';

test('@tools/collect/fluent-set', () => {
  test('intersect', () => {
    should(`create a set containing common entries`, () => {
      assert(new FluentSet(new Set([1, 2, 3])).intersect(new Set([2, 3, 4]))).to
          .haveExactElements(new Set([2, 3]));
    });
  });
});

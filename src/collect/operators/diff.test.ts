import { assert, should, test } from 'gs-testing';

import { $ } from './chain';
import { diff } from './diff';

test('@tools/collect/operators/diff', () => {
  should(`return set with elements removed from the first set`, () => {
    assert($(new Set([1, 2, 3]), diff(new Set([2, 3, 4])))).to.haveExactElements(new Set([1]));
  });

  should(`return empty set if the first set is empty`, () => {
    assert($(new Set([]), diff(new Set([2, 3, 4])))).to.beEmpty();
  });
});

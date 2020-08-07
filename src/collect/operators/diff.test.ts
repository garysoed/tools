import { assert, should, test } from 'gs-testing';

import { diff } from './diff';
import { $pipe } from './pipe';

test('@tools/collect/operators/diff', () => {
  should(`return set with elements removed from the first set`, () => {
    assert($pipe(new Set([1, 2, 3]), diff(new Set([2, 3, 4])))).to.haveExactElements(new Set([1]));
  });

  should(`return empty set if the first set is empty`, () => {
    assert($pipe(new Set([]), diff(new Set([2, 3, 4])))).to.beEmpty();
  });
});

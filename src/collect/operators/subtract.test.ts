import {assert, should, test} from 'gs-testing';

import {$pipe} from '../../typescript/pipe';

import {$subtract} from './subtract';

test('@tools/collect/operators/subtract', () => {
  should('return set with elements removed from the first set', () => {
    assert(
        $pipe(
            new Set([1, 2, 3]),
            $subtract(new Set([2, 3, 4])),
        ),
    ).to.haveExactElements(new Set([1]));
  });

  should('return empty set if the first set is empty', () => {
    assert($pipe(new Set([]), $subtract(new Set([2, 3, 4])))).to.beEmpty();
  });
});

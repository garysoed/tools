import {assert, should, test} from 'gs-testing';

import {$pipe} from '../../typescript/pipe';

import {$asSet} from './as-set';
import {$filterDefined} from './filter-defined';

test('@tools/collect/operators/filter-not-defined', () => {
  should('return items excluding the undefined items', () => {
    assert(
        $pipe(
            new Set([1, 2, undefined, 3]),
            $filterDefined(),
            $asSet(),
        ),
    ).to.haveExactElements(new Set([1, 2, 3]));
  });
});

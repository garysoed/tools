import { assert, should, test } from 'gs-testing';

import { $pipe } from './pipe';
import { asSet } from './as-set';
import { filterNonNull } from './filter-non-null';

test('@tools/collect/operators/filter-non-null', () => {
  should('return items excluding the null items', () => {
    assert(
        $pipe(
            new Set([1, 2, null, 3]),
            filterNonNull(),
            asSet(),
        ),
    ).to.haveExactElements(new Set([1, 2, 3]));
  });
});

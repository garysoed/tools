import { assert, should, test } from 'gs-testing';

import { asSet } from './as-set';
import { $ } from './chain';
import { filterDefined } from './filter-defined';

test('@tools/collect/operators/filter-not-defined', () => {
  should(`return items excluding the undefined items`, () => {
    assert(
        $(
            new Set([1, 2, undefined, 3]),
            filterDefined(),
            asSet(),
        ),
    ).to.haveExactElements(new Set([1, 2, 3]));
  });
});

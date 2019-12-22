import { assert, should, test } from '@gs-testing';

import { $ } from './chain';
import { filterNonNull } from './filter-non-null';

test('@tools/collect/operators/filter-non-null', () => {
  should(`return items excluding the null items`, () => {
    assert($(new Set([1, 2, null, 3]), filterNonNull())).to.haveElements(new Set([1, 2, 3]));
  });
});

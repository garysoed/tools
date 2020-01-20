import { assert, should, test } from '@gs-testing';

import { following } from './following';

test('@tools/collect/compare/following', () => {
  should(`follow the given array`, () => {
    const ordering = following([2, 3, 1]);
    assert(ordering(1, 2)).to.equal(1);
    assert(ordering(2, 3)).to.equal(-1);
    assert(ordering(2, 2)).to.equal(0);
  });
});

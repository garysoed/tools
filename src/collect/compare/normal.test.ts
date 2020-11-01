import { assert, should, test } from 'gs-testing';

import { normal } from './normal';

test('@tools/collect/compare/normal', () => {
  should('return -1 if the first item is smaller than the second', () => {
    assert(normal()(1, 2)).to.equal(-1);
  });

  should('return 1 if the first item is larger than the second', () => {
    assert(normal()(2, 1)).to.equal(1);
  });

  should('return 0 if both items are equal', () => {
    assert(normal()(2, 2)).to.equal(0);
  });
});

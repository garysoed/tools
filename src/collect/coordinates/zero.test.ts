import {assert, should, test} from 'gs-testing';

import {zero} from './zero';

test('@tools/src/collect/coordinates/zero', () => {
  should('create correct zero vector when dimension is 2', () => {
    assert(zero(2)).to.equal([0, 0]);
  });

  should('create correct zero vector when dimension is 3', () => {
    assert(zero(3)).to.equal([0, 0, 0]);
  });
});

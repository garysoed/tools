import { assert, should, test } from 'gs-testing';

import { FakeSeed } from '../testing/fake-seed';
import { fromSeed } from '../random';

import { randomItem } from './random-item';


test('@tools/random/operators/random-item', () => {
  should('return the correct member of the list', () => {
    const rng = fromSeed(new FakeSeed([0.6]));

    assert(randomItem(['a', 'b', 'c', 'd', 'e'], rng)).to.equal('d');
  });
});

import { assert, should, test } from '@gs-testing';

import { RandomGenerator } from '../random-generator';
import { fakeSeed } from '../testing/fake-seed';

import { randomItem } from './random-item';

test('@tools/random/operators/random-item', () => {
  should('return the correct member of the list', () => {
    const rng = new RandomGenerator(fakeSeed([0.6]));

    assert(randomItem(['a', 'b', 'c', 'd', 'e'], rng)[0]).to.equal('d');
  });
});

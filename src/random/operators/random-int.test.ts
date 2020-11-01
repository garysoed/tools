import { assert, should, test } from 'gs-testing';

import { FakeSeed } from '../testing/fake-seed';
import { fromSeed } from '../random';

import { randomInt } from './random-int';

test('@tools/random/operators/random-int', () => {
  should('return the correct integer from the range', () => {
    const rng = fromSeed(new FakeSeed([0.4]));

    assert(randomInt(0, 10, rng)).to.equal(4);
  });
});

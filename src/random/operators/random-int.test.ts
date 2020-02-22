import { assert, should, test } from 'gs-testing';

import { fromSeed } from '../random';
import { FakeSeed } from '../testing/fake-seed';

import { randomInt } from './random-int';

test('@tools/random/operators/random-int', () => {
  should('return the correct integer from the range', () => {
    const rng = fromSeed(new FakeSeed([0.4]));

    assert(randomInt(0, 10, rng).value).to.equal(4);
  });
});

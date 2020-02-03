import { assert, should, test } from '@gs-testing';

import { RandomGenerator } from '../random-generator';
import { fakeSeed } from '../testing/fake-seed';

import { randomInt } from './random-int';

test('@tools/random/operators/random-int', () => {
  should('return the correct integer from the range', () => {
    const rng = new RandomGenerator(fakeSeed([0.4]));

    assert(randomInt(0, 10, rng)[0]).to.equal(4);
  });
});

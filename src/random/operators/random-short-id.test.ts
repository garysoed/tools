import { assert, should, test } from '@gs-testing';

import { RandomGenerator } from '../random-generator';
import { fakeSeed } from '../testing/fake-seed';

import { randomShortId } from './random-short-id';

test('@tools/random/operators/random-short-id', () => {
  should('generate the correct ID', () => {
    const rng = new RandomGenerator(fakeSeed([
      0 / 62,
      10 / 62,
      11 / 62,
      12 / 62,
      36 / 62,
      37 / 62,
      38 / 62,
    ]));

    assert(randomShortId(rng)[0]).to.equal('0ABCabc');
  });
});

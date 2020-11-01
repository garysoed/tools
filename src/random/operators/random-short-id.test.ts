import { assert, should, test } from 'gs-testing';

import { FakeSeed } from '../testing/fake-seed';
import { fromSeed } from '../random';

import { randomShortId } from './random-short-id';


test('@tools/random/operators/random-short-id', () => {
  should('generate the correct ID', () => {
    const rng = fromSeed(new FakeSeed([
      0 / 62,
      10 / 62,
      11 / 62,
      12 / 62,
      36 / 62,
      37 / 62,
      38 / 62,
    ]));

    assert(randomShortId(rng)).to.equal('0ABCabc');
  });
});

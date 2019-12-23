import { assert, should, test } from '@gs-testing';

import { randomTakeMultiple } from '../operators/random-take-multiple';

import { aleaSeed } from './alea-seed';

test('@tools/random/alea-rng', () => {
  should(`produce the same sequence with the same seed`, () => {
    const seed = 123;
    assert(randomTakeMultiple(aleaSeed(seed), 5, values => values)[0]).to
        .haveExactElements(randomTakeMultiple(aleaSeed(seed), 5, values => values)[0]);
  });

  should(`produce the same sequence when branched`, () => {
    const seed = 123;
    const rng = aleaSeed(seed);
    const [, newGenerator1] = rng.next();
    const [, newGenerator2] = rng.next();
    assert(randomTakeMultiple(newGenerator1, 5, values => values)[0]).to.haveExactElements(
        randomTakeMultiple(newGenerator2, 5, values => values)[0]);
  });
});

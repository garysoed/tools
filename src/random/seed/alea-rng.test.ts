import { assert, should, test } from '@gs-testing';

import { RandomGenerator } from '../random-generator';

import { aleaSeed } from './alea-seed';

test('@tools/random/alea-rng', () => {
  should(`produce the same sequence with the same seed`, () => {
    const seed = 123;
    assert(new RandomGenerator(aleaSeed(seed)).next(5)[0]).to
        .haveExactElements(new RandomGenerator(aleaSeed(seed)).next(5)[0]);
  });

  should(`produce the same sequence when branched`, () => {
    const seed = 123;
    const rng = aleaSeed(seed);
    const [, newGenerator1] = rng.next();
    const [, newGenerator2] = rng.next();
    assert(new RandomGenerator(newGenerator1).next(5)[0]).to.haveExactElements(
        new RandomGenerator(newGenerator2).next(5)[0]);
  });
});

import { assert, should, test } from 'gs-testing';

import { fromSeed, Random } from '../random';

import { aleaSeed } from './alea-seed';


test('@tools/random/alea-rng', () => {
  should(`produce the same sequence with the same seed`, () => {
    const seed = 123;
    const sequence1 = fromSeed(aleaSeed(seed)).next(5, getRandom).value;
    const sequence2 = fromSeed(aleaSeed(seed)).next(5, getRandom).value;
    assert(sequence1).to.haveExactElements(sequence2);
  });

  should(`produce the same sequence when branched`, () => {
    const seed = 123;
    const rng = aleaSeed(seed);
    const [, newSeed1] = rng.next();
    const [, newSeed2] = rng.next();

    const sequence1 = fromSeed(newSeed1).next(5, getRandom).value;
    const sequence2 = fromSeed(newSeed2).next(5, getRandom).value;
    assert(sequence1).to.haveExactElements(sequence2);
  });
});

function getRandom(
    obj: {random: readonly number[]; rng: Random<unknown>},
): Random<readonly number[]> {
  return obj.rng.map(() => obj.random);
}

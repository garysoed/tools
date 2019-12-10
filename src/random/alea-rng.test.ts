import { assert, should, test } from '@gs-testing';

import { aleaRng } from './alea-rng';
import { randomTakeMultiple } from './operators/random-take-multiple';

test('@tools/random/alea-rng', () => {
  should(`produce the same sequence with the same seed`, () => {
    const seed = 123;
    assert(randomTakeMultiple(aleaRng(seed), 5, values => values)[0]).to
        .haveExactElements(randomTakeMultiple(aleaRng(seed), 5, values => values)[0]);
  });

  should(`produce the same sequence when branched`, () => {
    const seed = 123;
    const rng = aleaRng(seed);
    const [, newGenerator1] = rng.next();
    const [, newGenerator2] = rng.next();
    assert(randomTakeMultiple(newGenerator1, 5, values => values)[0]).to.haveExactElements(
        randomTakeMultiple(newGenerator2, 5, values => values)[0]);
  });
});

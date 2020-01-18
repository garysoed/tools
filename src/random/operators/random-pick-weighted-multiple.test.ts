import { assert, should, test } from '@gs-testing';

import { fakeRng } from '../testing/fake-rng';

import { randomPickWeightedMultiple } from './random-pick-weighted-multiple';

test('@tools/random/operators/random-pick-weighted-multiple', () => {
  should(`return the items according to the RNG`, () => {
    const fakeGenerator = fakeRng([0.5]);
    const [result] = randomPickWeightedMultiple(
        [
          ['a', 1],
          ['b', 2],
          ['c', 3],
        ],
        2,
        fakeGenerator,
    );

    assert(result).to.haveExactElements(['b', 'c']);
  });
});

import { assert, should, test } from '@gs-testing';

import { RandomGenerator } from '../random-generator';
import { fakeSeed } from '../testing/fake-seed';

import { randomPickWeightedMultiple } from './random-pick-weighted-multiple';


test('@tools/random/operators/random-pick-weighted-multiple', () => {
  should(`return the items according to the RNG`, () => {
    const seed = fakeSeed([0.5]);
    const [result] = randomPickWeightedMultiple(
        [
          ['a', 1],
          ['b', 2],
          ['c', 3],
        ],
        2,
        new RandomGenerator(seed),
    );

    assert(result).to.haveExactElements(['b', 'c']);
  });
});

import {assert, should, test} from 'gs-testing';

import {fromSeed} from '../random';
import {FakeSeed} from '../testing/fake-seed';

import {randomPickWeightedMultiple} from './random-pick-weighted-multiple';


test('@tools/random/operators/random-pick-weighted-multiple', () => {
  should('return the items according to the RNG', () => {
    const seed = new FakeSeed([0.5]);
    const result = randomPickWeightedMultiple(
        [
          ['a', 1],
          ['b', 2],
          ['c', 3],
        ],
        2,
        fromSeed(seed),
    );

    assert(result).to.haveExactElements(['b', 'c']);
  });
});

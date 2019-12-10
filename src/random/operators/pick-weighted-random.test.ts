import { assert, should, test } from '@gs-testing';

import { fakeRng } from '../testing/fake-rng';

import { pickWeightedRandom } from './pick-weighted-random';


test('@tools/random/pick-weighted-random', () => {
  should(`return the value at the given random result`, () => {
    assert(pickWeightedRandom([['a', 2], ['b', 3]], fakeRng([0.5]))[0]).to.equal('b');
  });

  should(`return null if the array is empty`, () => {
    assert(pickWeightedRandom([], fakeRng([0.5]))[0]).to.beNull();
  });
});

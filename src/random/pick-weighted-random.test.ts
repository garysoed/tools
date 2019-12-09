import { assert, should, test } from '@gs-testing';

import { pickWeightedRandom } from './pick-weighted-random';


test('@tools/random/pick-weighted-random', () => {
  should(`return the value at the given random result`, () => {
    assert(pickWeightedRandom([['a', 2], ['b', 3]], {state: null, value: 0.5}).value).to.equal('b');
  });

  should(`return null if the array is empty`, () => {
    assert(pickWeightedRandom([], {state: null, value: 0.5}).value).to.beNull();
  });
});

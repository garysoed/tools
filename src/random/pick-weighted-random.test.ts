import { assert, should, test } from '@gs-testing';

import { pickWeightedRandom } from './pick-weighted-random';


test('@tools/random/pick-weighted-random', () => {
  should(`return the value at the given random result`, () => {
    assert(pickWeightedRandom([['a', 2], ['b', 3]], {state: null, item: 0.5}).item).to.equal('b');
  });

  should(`return null if the array is empty`, () => {
    assert(pickWeightedRandom([], {state: null, item: 0.5}).item).to.beNull();
  });
});

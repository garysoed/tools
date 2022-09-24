import {assert, should, test} from 'gs-testing';


import {shuffleWeighted} from './shuffle-weighted';
import {incrementingRandom} from './testing/incrementing-random';


test('@tools/src/random/random-pick-weighted', () => {
  should('shuffle with the weights taken into account', () => {
    assert(shuffleWeighted([['a', 0.5], ['b', 0.3]], incrementingRandom(10)).run(0.5))
        .to.haveExactElements(['b', 'a']);
  });
});

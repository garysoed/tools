import {assert, should, test} from 'gs-testing';

import {shuffle} from './shuffle';
import {incrementingRandom} from './testing/incrementing-random';

test('@tools/src/random/shuffle', () => {
  should('order the items correctly', () => {
    const randomGen = incrementingRandom(3);

    const shuffled = shuffle([5, 2, 4], randomGen).run(2);
    assert(shuffled).to.haveExactElements([2, 4, 5]);
  });
});
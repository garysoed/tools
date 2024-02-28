import {assert, should, test} from 'gs-testing';

import {randomPickItem} from './random-pick-item';
import {incrementingRandom} from './testing/incrementing-random';

test('@tools/src/random/random-pick-item', () => {
  should('return the correct member of the list', () => {
    const seed = incrementingRandom(10);

    assert(randomPickItem(['a', 'b', 'c', 'd', 'e'], seed).run(0.8)).to.equal(
      'c',
    );
  });
});

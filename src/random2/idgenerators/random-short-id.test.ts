import {assert, should, test} from 'gs-testing';

import {incrementingRandom} from '../testing/incrementing-random';

import {randomShortId} from './random-short-id';


test('@tools/src/random2/idgenerators/random-short-id', () => {
  should('generate the correct ID', () => {
    const seed = incrementingRandom(31);

    assert(randomShortId(seed).run(1 / 31)).to.equal('2468ACE');
  });
});

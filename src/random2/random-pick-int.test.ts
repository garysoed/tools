import {assert, should, test} from 'gs-testing';


import {randomPickInt} from './random-pick-int';
import {incrementingRandom} from './testing/incrementing-random';


test('@tools/src/random2/random-pick-item', () => {
  should('return the correct integer from the range', () => {
    const seed = incrementingRandom(5);

    assert(randomPickInt(2, 12, seed).run(0.4)).to.equal(6);
  });

  should('clamp to the from value', () => {
    const seed = incrementingRandom(5);

    assert(randomPickInt(2, 12, seed).run(0)).to.equal(2);
  });

  should('clamp to the to value', () => {
    const seed = incrementingRandom(5);

    assert(randomPickInt(2, 12, seed).run(4)).to.equal(12);
  });
});

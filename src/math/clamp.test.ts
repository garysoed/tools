import {assert, should, test} from 'gs-testing';

import {clamp} from './clamp';

test('@tools/src/math/clamp', () => {
  should('return the same value if the value is within the range', () => {
    assert(clamp(12, 5, 15)).to.equal(12);
  });

  should('return the min value if the value is lower than the min', () => {
    assert(clamp(0, 5, 15)).to.equal(5);
  });

  should('return the max value if the value is larger than the max', () => {
    assert(clamp(20, 5, 15)).to.equal(15);
  });
});
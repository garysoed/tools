import {assert, should, test} from 'gs-testing';

import {asArray} from './as-array';
import {$pipe} from './pipe';


test('@tools/collect/operators/as-array', () => {
  should('return the array correctly', () => {
    assert($pipe([1, 2, 3], asArray())).to.haveExactElements([1, 2, 3]);
  });
});


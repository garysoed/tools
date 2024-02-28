import {assert, should, test} from 'gs-testing';

import {$pipe} from '../../typescript/pipe';

import {$reverse} from './reverse';

test('@tools/src/collect/operators/reverse', () => {
  should('reverse the given array', () => {
    assert($pipe([1, 2, 3], $reverse())).to.equal([3, 2, 1]);
  });
});

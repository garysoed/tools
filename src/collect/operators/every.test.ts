import {assert, should, test} from 'gs-testing';

import {every} from './every';
import {$pipe} from './pipe';

test('@tools/collect/operators/every', () => {
  should('return true if all elements are true', () => {
    assert($pipe(new Set([true, true, true]), every())).to.beTrue();
  });

  should('return false if an element is false', () => {
    assert($pipe(new Set([true, false, true]), every())).to.beFalse();
  });
});

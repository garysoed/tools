import { assert, should, test } from 'gs-testing';

import { $pipe } from './pipe';
import { every } from './every';

test('@tools/collect/operators/every', () => {
  should('return true if all elements are true', () => {
    assert($pipe(new Set([true, true, true]), every())).to.beTrue();
  });

  should('return false if an element is false', () => {
    assert($pipe(new Set([true, false, true]), every())).to.beFalse();
  });
});

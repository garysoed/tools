import { $pipe } from './pipe';
import { asSet } from './as-set';
import { assert, should, test } from 'gs-testing';


test('@tools/collect/operators/as-set', () => {
  should('return the set with correct items', () => {
    assert($pipe([1, 1, 2, 3, 2], asSet())).to.haveExactElements(new Set([1, 2, 3]));
  });
});

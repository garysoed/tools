import { $pipe } from './pipe';
import { asArray } from './as-array';
import { assert, should, test } from 'gs-testing';


test('@tools/collect/operators/as-array', () => {
  should('return the array correctly', () => {
    assert($pipe([1, 2, 3], asArray())).to.haveExactElements([1, 2, 3]);
  });
});


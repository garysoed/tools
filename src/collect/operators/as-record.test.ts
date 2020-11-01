import { assert, should, test } from 'gs-testing';

import { $pipe } from './pipe';
import { asRecord } from './as-record';

test('@tools/collect/operators/as-record', () => {
  should('return the correct record', () => {
    assert($pipe([['a', 1], ['b', 2], ['c', 3]], asRecord())).to.haveProperties({
      a: 1,
      b: 2,
      c: 3,
    });
  });
});

import {assert, should, test} from 'gs-testing';

import {$asRecord} from './as-record';
import {$pipe} from './pipe';

test('@tools/collect/operators/as-record', () => {
  should('return the correct record', () => {
    assert($pipe([['a', 1], ['b', 2], ['c', 3]], $asRecord())).to.haveProperties({
      a: 1,
      b: 2,
      c: 3,
    });
  });
});

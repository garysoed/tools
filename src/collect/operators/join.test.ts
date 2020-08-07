import { assert, should, test } from 'gs-testing';

import { join } from './join';
import { $pipe } from './pipe';

test('@tools/collect/operators/join', () => {
  should(`join the items`, () => {
    assert($pipe(['a', 'b', 'c'], join(','))).to.equal('a,b,c');
  });
});

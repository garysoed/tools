import {assert, should, test} from 'gs-testing';

import {$pipe} from '../../typescript/pipe';

import {$join} from './join';

test('@tools/collect/operators/join', () => {
  should('join the items', () => {
    assert($pipe(['a', 'b', 'c'], $join(','))).to.equal('a,b,c');
  });
});

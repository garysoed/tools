import {assert, should, test} from 'gs-testing';

import {$pipe} from '../../typescript/pipe';

import {$flat} from './flat';

test('@tools/collect/operators/flat', () => {
  should('flatten the elements', () => {
    assert($pipe([[1, 2], [3], [4, 5]], $flat())).to.startWith([1, 2, 3, 4, 5]);
  });
});

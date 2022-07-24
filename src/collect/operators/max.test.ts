import {assert, should, test} from 'gs-testing';

import {$pipe} from '../../typescript/pipe';
import {normal} from '../compare/normal';

import {$max} from './max';


test('@tools/collect/operators/max', () => {
  should('return the largest element in the array', () => {
    assert($pipe([2, 4, 1, 3], $max(normal()))).to.equal(4);
  });
});

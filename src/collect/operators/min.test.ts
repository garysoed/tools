import {assert, should, test} from 'gs-testing';

import {normal} from '../compare/normal';

import {min} from './min';
import {$pipe} from './pipe';


test('@tools/collect/operators/min', () => {
  should('return the smallest element in the array', () => {
    assert($pipe([2, 4, 1, 3], min(normal()))).to.equal(1);
  });
});

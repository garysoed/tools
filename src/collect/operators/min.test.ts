import { assert, should, test } from 'gs-testing';

import { normal } from '../compare/normal';

import { $pipe } from './pipe';
import { min } from './min';


test('@tools/collect/operators/min', () => {
  should('return the smallest element in the array', () => {
    assert($pipe([2, 4, 1, 3], min(normal()))).to.equal(1);
  });
});

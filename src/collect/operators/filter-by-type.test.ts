import { assert, should, test } from 'gs-testing';
import { numberType } from 'gs-types';

import { $pipe } from './pipe';
import { asArray } from './as-array';
import { filterByType } from './filter-by-type';


test('@tools/collect/operators/filter-by-type', () => {
  should('only filter items with correct type', () => {
    assert($pipe([1, 'a', 2], filterByType(numberType), asArray())).to.haveExactElements([1, 2]);
  });
});

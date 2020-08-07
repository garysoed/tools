import { assert, should, test } from 'gs-testing';
import { numberType } from 'gs-types';

import { asArray } from './as-array';
import { filterByType } from './filter-by-type';
import { $pipe } from './pipe';


test('@tools/collect/operators/filter-by-type', () => {
  should(`only filter items with correct type`, () => {
    assert($pipe([1, 'a', 2], filterByType(numberType), asArray())).to.haveExactElements([1, 2]);
  });
});

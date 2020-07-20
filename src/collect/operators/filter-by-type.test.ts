import { assert, numberThat, run, should, test } from 'gs-testing';
import { numberType } from 'gs-types';
import { of as observableOf } from 'rxjs';

import { asArray } from './as-array';
import { $ } from './chain';
import { filterByType } from './filter-by-type';

test('@tools/collect/operators/filter-by-type', () => {
  should(`only filter items with correct type`, () => {
    assert($([1, 'a', 2], filterByType(numberType), asArray())).to.haveExactElements([1, 2]);
  });
});

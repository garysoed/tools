import {assert, should, test} from 'gs-testing';
import {numberType} from 'gs-types';

import {byType} from './by-type';

test('@tools/collect/compare/by-type', () => {
  should('return -1 if the first item is earlier in the type list', () => {
    assert(byType([numberType])('a', 1)).to.equal(1);
  });

  should('return 0 if both items match the list', () => {
    assert(byType([numberType])(1, 1)).to.equal(0);
  });

  should('return 0 if none of the items match the list', () => {
    assert(byType([numberType])('1', '1')).to.equal(0);
  });
});

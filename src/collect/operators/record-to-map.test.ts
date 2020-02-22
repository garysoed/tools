import { assert, should, test } from 'gs-testing';

import { $ } from './chain';
import { recordToMap } from './record-to-map';

test('@tools/collect/operators/record-to-map', () => {
  should(`convert to map correctly`, () => {
    assert($({a: 1, b: 2}, recordToMap())).to.haveExactElements(new Map([
      ['a', 1],
      ['b', 2],
    ]));
  });
});

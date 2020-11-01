import { $pipe } from './pipe';
import { asMap } from './as-map';
import { assert, should, test } from 'gs-testing';


test('@tools/collect/operators/as-map', () => {
  should('return the map correctly', () => {
    assert($pipe([['a', 1], ['b', 2], ['c', 3]], asMap())).to.haveExactElements(new Map([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]));
  });
});

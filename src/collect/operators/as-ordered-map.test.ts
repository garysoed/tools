import {assert, should, test, tupleThat} from 'gs-testing';

import {$pipe} from '../../typescript/pipe';

import {$asOrderedMap} from './as-ordered-map';


test('@tools/collect/operators/as-ordered-map', () => {
  should('return the ordered map correctly', () => {
    assert($pipe([['a', 1], ['b', 2], ['c', 3]], $asOrderedMap())).to.startWith([
      tupleThat<[string, number]>().haveExactElements(['a', 1]),
      tupleThat<[string, number]>().haveExactElements(['b', 2]),
      tupleThat<[string, number]>().haveExactElements(['c', 3]),
    ]);
  });
});

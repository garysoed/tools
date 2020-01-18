import { assert, should, test, tupleThat } from '@gs-testing';

import { asArray } from './as-array';
import { $ } from './chain';
import { zip } from './zip';

test('@tools/collect/operators/zip', () => {
  should(`combine the values together`, () => {
    assert($(['a', 'b', 'c'], zip([1, 2, 3]), asArray())).to.haveExactElements([
      tupleThat<[string, number]>().haveExactElements(['a', 1]),
      tupleThat<[string, number]>().haveExactElements(['b', 2]),
      tupleThat<[string, number]>().haveExactElements(['c', 3]),
    ]);
  });

  should(`stop early if the source iterable is too short`, () => {
    assert($(['a', 'b'], zip([1, 2, 3]), asArray())).to.haveExactElements([
      tupleThat<[string, number]>().haveExactElements(['a', 1]),
      tupleThat<[string, number]>().haveExactElements(['b', 2]),
    ]);
  });

  should(`stop early if the second iterable is too short`, () => {
    assert($(['a', 'b', 'c'], zip([1, 2]), asArray())).to.haveExactElements([
      tupleThat<[string, number]>().haveExactElements(['a', 1]),
      tupleThat<[string, number]>().haveExactElements(['b', 2]),
    ]);
  });
});

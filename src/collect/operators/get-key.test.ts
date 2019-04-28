import { assert, match, setup, should, test } from '@gs-testing';
import { pipe } from '../pipe';
import { createInfiniteMap, InfiniteMap } from '../types/infinite-map';
import { getKey } from './get-key';

test('collect.operators.getKey', () => {
  let map: InfiniteMap<string, number>;

  setup(() => {
    map = createInfiniteMap(new Map([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]));
  });

  should(`get the entries correctly`, () => {
    assert([...pipe(map, getKey('a', 'b', 'z'))()]).to.haveExactElements([
      match.anyTupleThat<[string, number]>().haveExactElements(['a', 1]),
      match.anyTupleThat<[string, number]>().haveExactElements(['b', 2]),
    ]);
  });
});

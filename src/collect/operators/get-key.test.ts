import { assert, match, setup, should, test } from 'gs-testing/export/main';
import { exec } from '../exec';
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
    assert([...exec(map, getKey('a', 'b', 'z'))()]).to.haveExactElements([
      match.anyTupleThat<[string, number]>().haveExactElements(['a', 1]),
      match.anyTupleThat<[string, number]>().haveExactElements(['b', 2]),
    ]);
  });
});

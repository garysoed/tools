import { assert, setup, should, test } from 'gs-testing/export/main';
import { pipe } from '../pipe';
import { createInfiniteMap, InfiniteMap } from '../types/infinite-map';
import { keys } from './keys';

test('collect.operators.keys', () => {
  let map: InfiniteMap<string, number>;

  setup(() => {
    map = createInfiniteMap(new Map([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]));
  });

  should(`return the keys correctly`, () => {
    assert([...pipe(map, keys())()]).to.haveExactElements(['a', 'b', 'c']);
  });
});

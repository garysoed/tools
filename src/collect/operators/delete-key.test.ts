import { assert, match, setup, should, test } from '@gs-testing';
import { pipe } from '../pipe';
import { createInfiniteMap, InfiniteMap } from '../types/infinite-map';
import { deleteKey } from './delete-key';

test('collect.operators.deleteKey', () => {
  let map: InfiniteMap<string, number>;

  setup(() => {
    map = createInfiniteMap(new Map([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]));
  });

  should(`delete the keys correctly`, () => {
    assert([...pipe(map, deleteKey('a', 'b', 'z'))()]).to.haveExactElements([
      match.anyTupleThat<[string, number]>().haveExactElements(['c', 3]),
    ]);
  });
});

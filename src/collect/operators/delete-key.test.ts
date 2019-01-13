import { assert, match, setup, should, test } from 'gs-testing/export/main';
import { generatorFrom } from '../generators';
import { InfiniteMap } from '../infinite-map';
import { deleteKey } from './delete-key';

test('collect.operators.deleteKey', () => {
  let map: InfiniteMap<string, number>;

  setup(() => {
    map = new InfiniteMap(generatorFrom(new Map([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ])));
  });

  should(`delete the keys correctly`, () => {
    assert([...map.$(deleteKey('a', 'b', 'z'))()]).to.haveExactElements([
      match.anyTupleThat<[string, number]>().haveExactElements(['c', 3]),
    ]);
  });
});

import { assert, match, setup, should, test } from 'gs-testing/export/main';
import { generatorFrom } from '../generators';
import { InfiniteMap } from '../infinite-map';
import { getKey } from './get-key';

test('collect.operators.getKey', () => {
  let map: InfiniteMap<string, number>;

  setup(() => {
    map = new InfiniteMap(generatorFrom(new Map([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ])));
  });

  should(`get the entries correctly`, () => {
    assert([...map.$(getKey('a', 'b', 'z'))()]).to.haveExactElements([
      match.anyTupleThat<[string, number]>().haveExactElements(['a', 1]),
      match.anyTupleThat<[string, number]>().haveExactElements(['b', 2]),
    ]);
  });
});

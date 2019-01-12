import { assert, setup, should, test } from 'gs-testing/export/main';
import { generatorFrom } from '../generators';
import { InfiniteMap } from '../infinite-map';
import { keys } from './keys';

test('collect.operators.keys', () => {
  let map: InfiniteMap<string, number>;

  setup(() => {
    map = new InfiniteMap(generatorFrom(new Map([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ])));
  });

  should(`return the keys correctly`, () => {
    assert([...map.transform(keys())()]).to.haveExactElements(['a', 'b', 'c']);
  });
});

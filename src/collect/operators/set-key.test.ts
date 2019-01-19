import { assert, match, setup, should, test } from 'gs-testing/export/main';
import { exec } from '../exec';
import { createInfiniteMap, InfiniteMap } from '../types/infinite-map';
import { setKey } from './set-key';

test('collect.operators.setKey', () => {
  let map: InfiniteMap<string, number>;

  setup(() => {
    map = createInfiniteMap(new Map([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ]));
  });

  should(`set the entries correctly`, () => {
    const newGenerator = exec(
        map,
        setKey(
          ['a', ['2', 2]],
          ['b', ['4', 4]],
          ['z', ['0', 0]],
        ),
    );
    assert([...newGenerator()]).to.haveExactElements([
      match.anyTupleThat<[string, number]>().haveExactElements(['2', 2]),
      match.anyTupleThat<[string, number]>().haveExactElements(['4', 4]),
      match.anyTupleThat<[string, number]>().haveExactElements(['c', 3]),
    ]);
  });
});

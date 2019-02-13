import { assert, match, setup, should, test } from 'gs-testing/export/main';
import { pipe } from '../pipe';
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
    const newGenerator = pipe(
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

  should(`insert a new entry at the end correctly`, () => {
    const newGenerator = pipe(map, setKey(['d', ['d', 4]]));
    assert([...newGenerator()]).to.haveExactElements([
      match.anyTupleThat<[string, number]>().haveExactElements(['a', 1]),
      match.anyTupleThat<[string, number]>().haveExactElements(['b', 2]),
      match.anyTupleThat<[string, number]>().haveExactElements(['c', 3]),
      match.anyTupleThat<[string, number]>().haveExactElements(['d', 4]),
    ]);
  });
});

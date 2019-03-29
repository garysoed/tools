import { assert, match, should, test } from '@gs-testing/main';
import { pipe } from '../pipe';
import { createInfiniteMap } from '../types/infinite-map';
import { mapPick } from './map-pick';

test('collect.operators.mapPick', () => {
  should(`map the values correctly`, () => {
    const list = createInfiniteMap([['a', 1], ['b', 2], ['c', 3]]);
    assert([...pipe(list, mapPick(1, i => `${i}`))()]).to
        .haveExactElements([
          match.anyTupleThat<[string, string]>().haveExactElements(['a', '1']),
          match.anyTupleThat<[string, string]>().haveExactElements(['b', '2']),
          match.anyTupleThat<[string, string]>().haveExactElements(['c', '3']),
        ]);
  });
});

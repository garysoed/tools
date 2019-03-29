import { assert, setup, should, test } from '@gs-testing/main';
import { pipe } from '../pipe';
import { createImmutableList, ImmutableList } from '../types/immutable-list';
import { reverse } from './reverse';

test('collect.operators.reverse', () => {
  let list: ImmutableList<number>;

  setup(() => {
    list = createImmutableList([1, 2, 3]);
  });

  should(`reverse the items`, () => {
    assert([...pipe(list, reverse())()]).to.haveExactElements([3, 2, 1]);
  });
});

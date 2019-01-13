import { assert, setup, should, test } from 'gs-testing/export/main';
import { ImmutableList } from '../immutable-list';
import { reverse } from './reverse';

test('collect.operators.reverse', () => {
  let list: ImmutableList<number>;

  setup(() => {
    list = ImmutableList.of([1, 2, 3]);
  });

  should(`reverse the items`, () => {
    assert([...list.$(reverse())()]).to.haveExactElements([3, 2, 1]);
  });
});

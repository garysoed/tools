import { assert, setup, should, test } from 'gs-testing/export/main';
import { ImmutableList } from '../immutable-list';
import { push } from './push';

test('collect.operators.push', () => {
  let list: ImmutableList<number>;

  setup(() => {
    list = ImmutableList.of([1, 2, 3]);
  });

  should(`add all the given elements`, () => {
    assert([...list.$(push(4, 5, 6))()]).to.haveExactElements([1, 2, 3, 4, 5, 6]);
  });
});

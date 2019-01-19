import { assert, setup, should, test } from 'gs-testing/export/main';
import { exec } from '../exec';
import { createImmutableList, ImmutableList } from '../types/immutable-list';
import { push } from './push';

test('collect.operators.push', () => {
  let list: ImmutableList<number>;

  setup(() => {
    list = createImmutableList([1, 2, 3]);
  });

  should(`add all the given elements`, () => {
    assert([...exec(list, push(4, 5, 6))()]).to.haveExactElements([1, 2, 3, 4, 5, 6]);
  });
});

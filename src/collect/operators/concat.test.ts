import { assert, setup, should, test } from '@gs-testing/main';
import { countable } from '../generators';
import { pipe } from '../pipe';
import { createImmutableList, ImmutableList } from '../types/immutable-list';
import { concat } from './concat';
import { take } from './take';

test('gs-tools.collect.operators.concat', () => {
  let list: ImmutableList<number>;

  setup(() => {
    list = createImmutableList([1, 2, 3]);
  });

  should(`add all the given elements`, () => {
    assert([...pipe(list, concat(createImmutableList([4, 5, 6])))()])
        .to.haveExactElements([1, 2, 3, 4, 5, 6]);
  });

  should(`handle concatenating infinite list`, () => {
    assert([...pipe(list, concat(countable()), take(4))()]).to.haveExactElements([1, 2, 3, 0]);
  });
});

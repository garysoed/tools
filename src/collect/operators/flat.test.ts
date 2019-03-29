import { assert, should, test } from '@gs-testing/main';
import { pipe } from '../pipe';
import { createImmutableList } from '../types/immutable-list';
import { flat } from './flat';

test('collect.operators.flat', () => {
  should(`flatten the elements`, () => {
    const list = createImmutableList([
      createImmutableList([1, 2]),
      createImmutableList([3]),
      createImmutableList([4, 5]),
    ]);

    assert([...pipe(list, flat())()]).to.haveExactElements([1, 2, 3, 4, 5]);
  });
});

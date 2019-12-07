import { assert, setup, should, test } from '@gs-testing';
import { pipe } from '../pipe';
import { createImmutableList, ImmutableList } from '../types/immutable-list';
import { scan } from './scan';

test('collect.operators.scan', () => {
  let list: ImmutableList<number>;

  setup(() => {
    list = createImmutableList([1, 2, 3]);
  });

  should(`return the correct list`, () => {
    assert([...pipe(list, scan((p, c) => p + c, 2))()]).to.haveExactElements([3, 5, 8]);
  });
});

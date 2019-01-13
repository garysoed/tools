import { assert, setup, should, test } from 'gs-testing/export/main';
import { ImmutableList } from '../immutable-list';
import { scan } from './scan';

test('collect.operators.scan', () => {
  let list: ImmutableList<number>;

  setup(() => {
    list = ImmutableList.of([1, 2, 3]);
  });

  should(`return the correct list`, () => {
    assert([...list.$(scan((p, c) => p + c, 2))()]).to.haveExactElements([3, 5, 8]);
  });
});

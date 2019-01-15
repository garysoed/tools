import { assert, should, test } from 'gs-testing/export/main';
import { ImmutableList } from '../immutable-list';
import { distinct } from './distinct';

test('collect.operators.distinct', () => {
  should(`remove duplicate elements`, () => {
    const result = ImmutableList.of([1, 1, 2, 1, 2, 3]);
    assert([...result.$(distinct<number, void>())()]).to.haveExactElements([1, 2, 3]);
  });
});

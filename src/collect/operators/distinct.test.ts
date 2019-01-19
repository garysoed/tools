import { assert, should, test } from 'gs-testing/export/main';
import { exec } from '../exec';
import { createImmutableList } from '../types/immutable-list';
import { distinct } from './distinct';

test('collect.operators.distinct', () => {
  should(`remove duplicate elements`, () => {
    const result = createImmutableList([1, 1, 2, 1, 2, 3]);
    assert([...exec(result, distinct<number, void>())()]).to.haveExactElements([1, 2, 3]);
  });
});

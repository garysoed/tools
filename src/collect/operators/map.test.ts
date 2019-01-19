import { assert, should, test } from 'gs-testing/export/main';
import { exec } from '../exec';
import { createInfiniteList } from '../types/infinite-list';
import { map } from './map';

test('collect.operators.map', () => {
  should(`map the values correctly`, () => {
    const list = createInfiniteList([1, 2, 3]);
    assert([...exec(list, map(i => `${i}`))()]).to.haveExactElements(['1', '2', '3']);
  });
});

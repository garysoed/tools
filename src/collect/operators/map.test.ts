import { assert, should, test } from 'gs-testing/export/main';
import { generatorFrom } from '../generators';
import { InfiniteList } from '../infinite-list';
import { map } from './map';

test('collect.operators.map', () => {
  should(`map the values correctly`, () => {
    const list = new InfiniteList(generatorFrom([1, 2, 3]));
    assert([...list.$(map(i => `${i}`))()]).to.haveExactElements(['1', '2', '3']);
  });
});

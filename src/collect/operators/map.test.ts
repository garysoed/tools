import { assert, should, test } from 'gs-testing/export/main';
import { generatorFrom } from '../generators';
import { InfiniteList } from '../infinite-list';
import { map } from './map';

test('collect.operators.map', () => {
  should(`map the values correctly`, () => {
    const list = new InfiniteList(generatorFrom([1, 2, 3]));
    assert(list.transform(map<number, string>(i => `${i}`))()).to.startWith(['1', '2', '3']);
  });
});

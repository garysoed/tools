import { assert, should, test } from 'gs-testing/export/main';
import { generatorFrom } from '../generators';
import { InfiniteList } from '../infinite-list';
import { head } from './head';

test('collect.operators.head', () => {
  should(`take the first element`, () => {
    assert(new InfiniteList(generatorFrom([1, 2, 3])).transform(head())).to.equal(1);
  });

  should(`return undefined if empty`, () => {
    assert(new InfiniteList(generatorFrom([])).transform(head())).toNot.beDefined();
  });
});

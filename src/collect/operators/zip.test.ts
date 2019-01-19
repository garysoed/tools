import { assert, match, setup, should, test } from 'gs-testing/export/main';
import { exec } from '../exec';
import { generatorFrom } from '../generators';
import { InfiniteList } from '../types/infinite-list';
import { zip } from './zip';

test('collect.operators.zip', () => {
  let list: InfiniteList<number>;

  setup(() => {
    list = generatorFrom([1, 2, 3]);
  });

  should(`handle iterables with shorter lengths correctly`, () => {
    const iterableA = generatorFrom(['a', 'c']);
    const iterableB = generatorFrom(['1']);

    assert([...exec(list, zip(iterableA, iterableB))()]).to.haveExactElements([
      match.anyTupleThat<[number, string, string]>().haveExactElements([1, 'a', '1']),
    ]);
  });

  should(`handle iterables with longer lengths correctly`, () => {
    const iterableA = generatorFrom(['a', 'b', 'c', 'd']);
    const iterableB = generatorFrom(['1', '2', '3', '4', '5']);

    assert([...exec(list, zip(iterableA, iterableB))()]).to.haveExactElements([
      match.anyTupleThat<[number, string, string]>().haveExactElements([1, 'a', '1']),
      match.anyTupleThat<[number, string, string]>().haveExactElements([2, 'b', '2']),
      match.anyTupleThat<[number, string, string]>().haveExactElements([3, 'c', '3']),
    ]);
  });
});

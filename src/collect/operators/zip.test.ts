import { assert, match, setup, should, test } from 'gs-testing/export/main';
import { generatorFrom } from '../generators';
import { InfiniteList } from '../infinite-list';
import { zip } from './zip';

test('collect.operators.zip', () => {
  let list: InfiniteList<number>;

  setup(() => {
    list = new InfiniteList(generatorFrom([1, 2, 3]));
  });

  should(`handle iterables with shorter lengths correctly`, () => {
    const iterableA = new InfiniteList(generatorFrom(['a', 'c']));
    const iterableB = new InfiniteList(generatorFrom(['1']));

    assert([...list.transform(
        zip(iterableA.iterableFactory(), iterableB.iterableFactory()),
    )()]).to.haveExactElements([
      match.anyTupleThat<[number, string, string]>().haveExactElements([1, 'a', '1']),
    ]);
  });

  should(`handle iterables with longer lengths correctly`, () => {
    const iterableA = new InfiniteList(generatorFrom(['a', 'b', 'c', 'd']));
    const iterableB = new InfiniteList(generatorFrom(['1', '2', '3', '4', '5']));

    assert([...list.transform(
        zip(iterableA.iterableFactory(), iterableB.iterableFactory()),
    )()]).to.haveExactElements([
      match.anyTupleThat<[number, string, string]>().haveExactElements([1, 'a', '1']),
      match.anyTupleThat<[number, string, string]>().haveExactElements([2, 'b', '2']),
      match.anyTupleThat<[number, string, string]>().haveExactElements([3, 'c', '3']),
    ]);
  });
});

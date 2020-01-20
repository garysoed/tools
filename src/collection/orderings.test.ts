import { assert, should, test } from '@gs-testing';
import { sort } from './operators/sort';
import { Orderings } from './orderings';
import { pipe } from './pipe';
import { createImmutableList } from './types/immutable-list';



test('immutable.Orderings', () => {
  test('matches', () => {
    should(`order matching items at the start of the list`, () => {
      const list = createImmutableList([1, 2, 3]);
      assert([...pipe(list, sort(Orderings.matches((v => v > 1))))()]).to
          .haveExactElements([2, 3, 1]);
    });
  });

  test('isOneOf', () => {
    should(`order matching items at the start of the list`, () => {
      const list = createImmutableList([1, 2, 3]);
      assert([...pipe(list, sort(Orderings.isOneOf([3])))()]).to.haveExactElements([3, 1, 2]);
    });
  });

  test('type', () => {
  });
});

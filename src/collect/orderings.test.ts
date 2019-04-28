import { assert, should, test } from '@gs-testing';
import { NumberType } from '@gs-types';
import { CompareResult } from './compare-result';
import { pipe } from './pipe';
import { sort } from './operators/sort';
import { Orderings } from './orderings';
import { createImmutableList } from './types/immutable-list';


test('immutable.Orderings', () => {
  test('compound', () => {
    should(`use the first ordering and use the subsequent ones for tie breaking`, () => {
      const ordering = Orderings.compound(createImmutableList([
        () => 0 as CompareResult,
        Orderings.normal<number>(),
      ]));
      assert(ordering(0, 1)).to.equal(-1);
      assert(ordering(1, 0)).to.equal(1);
    });

    should(`return 0 if none of the given orderings can break ties`, () => {
      const ordering = Orderings.compound(createImmutableList([
        () => 0 as CompareResult,
      ]));
      assert(ordering(0, 1)).to.equal(0);
    });
  });

  test('map', () => {
    should(`order the items correctly`, () => {
      const a = {v: 1};
      const b = {v: 2};
      const list = createImmutableList([b, a]);

      const sorted = pipe(list, sort(Orderings.map(item => `${item.v}`, Orderings.natural())));
      assert([...sorted()]).to.haveExactElements([a, b]);
    });
  });

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

  test('natural', () => {
    should(`put 'a' before 'b'`, () => {
      assert(Orderings.natural()('a', 'b')).to.equal(-1);
    });

    should(`put '2' before '11'`, () => {
      assert(Orderings.natural()('2', '11')).to.equal(-1);
    });

    should(`put 'a2' before 'a11'`, () => {
      assert(Orderings.natural()('a2', 'a11')).to.equal(-1);
    });

    should(`put '2b' before '11a'`, () => {
      assert(Orderings.natural()('2b', '11a')).to.equal(-1);
    });

    should(`put '2a' before 'a'`, () => {
      assert(Orderings.natural()('2a', 'a')).to.equal(-1);
    });
  });

  test('normal', () => {
    should(`return -1 if the first item is smaller than the second`, () => {
      assert(Orderings.normal()(1, 2)).to.equal(-1);
    });

    should(`return 1 if the first item is larger than the second`, () => {
      assert(Orderings.normal()(2, 1)).to.equal(1);
    });

    should(`return 0 if both items are equal`, () => {
      assert(Orderings.normal()(2, 2)).to.equal(0);
    });
  });

  test('reverse', () => {
    should(`return 1 if the first item is smaller than the second`, () => {
      assert(Orderings.reverse(Orderings.normal())(2, 1)).to.equal(-1);
    });

    should(`return -1 if the first item is larger than the second`, () => {
      assert(Orderings.reverse(Orderings.normal())(1, 2)).to.equal(1);
    });

    should(`return 0 if both items are equal`, () => {
      assert(Orderings.reverse(Orderings.normal())(2, 2)).to.equal(0);
    });
  });

  test('type', () => {
    should(`return -1 if the first item is earlier in the type list`, () => {
      assert(Orderings.type(createImmutableList([NumberType])())('a', 1)).to.equal(1);
    });

    should(`return 0 if both items match the list`, () => {
      assert(Orderings.type(createImmutableList([NumberType])())(1, 1)).to.equal(0);
    });

    should(`return 0 if none of the items match the list`, () => {
      assert(Orderings.type(createImmutableList([NumberType])())('1', '1')).to.equal(0);
    });
  });
});

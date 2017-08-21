import { assert, TestBase } from '../test-base';
TestBase.setup();

import { NumberType } from '../check/number-type';
import { ImmutableList } from '../immutable/immutable-list';
import { Orderings } from '../immutable/orderings';
import { CompareResult } from '../interfaces/compare-result';


describe('immutable.Orderings', () => {
  describe('compound', () => {
    it(`should use the first ordering and use the subsequent ones for tie breaking`, () => {
      const ordering = Orderings.compound(ImmutableList.of([
        () => 0 as CompareResult,
        Orderings.normal<number>(),
      ]));
      assert(ordering(0, 1)).to.equal(-1);
      assert(ordering(1, 0)).to.equal(1);
    });

    it(`should return 0 if none of the given orderings can break ties`, () => {
      const ordering = Orderings.compound(ImmutableList.of([
        () => 0 as CompareResult,
      ]));
      assert(ordering(0, 1)).to.equal(0);
    });
  });

  describe('isOneOf', () => {
    it(`should order matching items at the start of the list`, () => {
      const list = ImmutableList.of([1, 2, 3]);
      assert(list.sort(Orderings.isOneOf([3]))).to.haveElements([3, 1, 2]);
    });
  });

  describe('natural', () => {
    it(`should put 'a' before 'b'`, () => {
      assert(Orderings.natural()('a', 'b')).to.equal(-1);
    });

    it(`should put '2' before '11'`, () => {
      assert(Orderings.natural()('2', '11')).to.equal(-1);
    });

    it(`should put 'a2' before 'a11'`, () => {
      assert(Orderings.natural()('a2', 'a11')).to.equal(-1);
    });

    it(`should put '2b' before '11a'`, () => {
      assert(Orderings.natural()('2b', '11a')).to.equal(-1);
    });

    it(`should put '2a' before 'a'`, () => {
      assert(Orderings.natural()('2a', 'a')).to.equal(-1);
    });
  });

  describe('normal', () => {
    it(`should return -1 if the first item is smaller than the second`, () => {
      assert(Orderings.normal()(1, 2)).to.equal(-1);
    });

    it(`should return 1 if the first item is larger than the second`, () => {
      assert(Orderings.normal()(2, 1)).to.equal(1);
    });

    it(`should return 0 if both items are equal`, () => {
      assert(Orderings.normal()(2, 2)).to.equal(0);
    });
  });

  describe('reverse', () => {
    it(`should return 1 if the first item is smaller than the second`, () => {
      assert(Orderings.reverse(Orderings.normal())(2, 1)).to.equal(-1);
    });

    it(`should return -1 if the first item is larger than the second`, () => {
      assert(Orderings.reverse(Orderings.normal())(1, 2)).to.equal(1);
    });

    it(`should return 0 if both items are equal`, () => {
      assert(Orderings.reverse(Orderings.normal())(2, 2)).to.equal(0);
    });
  });

  describe('type', () => {
    it(`should return -1 if the first item is earlier in the type list`, () => {
      assert(Orderings.type(ImmutableList.of([NumberType]))('a', 1)).to.equal(1);
    });

    it(`should return 0 if both items match the list`, () => {
      assert(Orderings.type(ImmutableList.of([NumberType]))(1, 1)).to.equal(0);
    });

    it(`should return 0 if none of the items match the list`, () => {
      assert(Orderings.type(ImmutableList.of([NumberType]))('1', '1')).to.equal(0);
    });
  });
});

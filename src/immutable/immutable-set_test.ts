import { assert, should } from 'gs-testing/export/main';
import { NumberType } from 'gs-types/export';
import { ImmutableSet } from '../immutable/immutable-set';
import { Orderings } from '../immutable/orderings';


describe('immutable.ImmutableSet', () => {
  describe('[Symbol.iterator]', () => {
    should('list the elements correctly', () => {
      const elements = [1, 2, 3, 4];
      const set = ImmutableSet.of(elements);
      assert(set).to.haveElements(elements);
    });
  });

  describe('add', () => {
    should('add the item correctly', () => {
      const set = ImmutableSet.of([1, 2, 3, 4]).add(5);
      assert(set).to.haveElements([1, 2, 3, 4, 5]);
    });
  });

  describe('addAll', () => {
    should('add the items correctly', () => {
      const set = ImmutableSet.of([1, 2, 3, 4]).addAll(ImmutableSet.of([5, 6, 7]));
      assert(set).to.haveElements([1, 2, 3, 4, 5, 6, 7]);
    });
  });

  describe('delete', () => {
    should('delete the item correctly', () => {
      const set = ImmutableSet.of([1, 2, 3, 4]).delete(3);
      assert(set).to.haveElements([1, 2, 4]);
    });
  });

  describe('deleteAll', () => {
    should('delete the items correctly', () => {
      const set = ImmutableSet.of([1, 2, 3, 4]).deleteAll(ImmutableSet.of([1, 3]));
      assert(set).to.haveElements([2, 4]);
    });
  });

  describe('everyItem', () => {
    should('return true if every element passes the check', () => {
      assert(ImmutableSet.of([1, 2, 3]).everyItem((i: number) => i > 0)).to.beTrue();
    });

    should('return false if one element does not pass the check', () => {
      assert(ImmutableSet.of([1, 2, 3]).everyItem((i: number) => i !== 2)).to.beFalse();
    });
  });

  describe('filterByType', () => {
    should('filter the items correctly', () => {
      const set = ImmutableSet
          .of([1, '2', 3, '4'])
          .filterByType(NumberType);
      assert(set).to.haveElements([1, 3]);
    });
  });

  describe('filterItem', () => {
    should('filter the items correctly', () => {
      const set = ImmutableSet
          .of([1, 2, 3, 4])
          .filterItem((item: number) => {
            return (item % 2) === 0;
          });
      assert(set).to.haveElements([2, 4]);
    });
  });

  describe('find', () => {
    should('return the matching item', () => {
      assert(ImmutableSet.of([1, 2, 3]).find((n: number) => n >= 2)).to.equal(2);
    });

    should('return null if there are no matches', () => {
      assert(ImmutableSet.of([1, 2, 3]).find(() => false)).to.beNull();
    });
  });

  describe('has', () => {
    should('return true if the item is in the set', () => {
      assert(ImmutableSet.of([1, 3]).has(1)).to.beTrue();
    });

    should('return false if the item is not in the set', () => {
      assert(ImmutableSet.of([1, 3]).has(2)).to.beFalse();
    });
  });

  describe('mapItem', () => {
    should('map the items correctly', () => {
      const set = ImmutableSet
          .of([1, 2, 3, 4])
          .mapItem((item: number) => {
            return `${item}`;
          });
      assert(set).to.haveElements(['1', '2', '3', '4']);
    });
  });

  describe('max', () => {
    should(`return the correct max item`, () => {
      assert(ImmutableSet.of([0, 2, 4, 3]).max(Orderings.normal())).to.equal(4);
    });

    should(`return null if the list is null`, () => {
      assert(ImmutableSet.of<number>([]).max(Orderings.normal())).to.beNull();
    });
  });

  describe('min', () => {
    should(`return the correct min item`, () => {
      assert(ImmutableSet.of([4, 2, 0, 3]).min(Orderings.normal())).to.equal(0);
    });

    should(`return null if the list is null`, () => {
      assert(ImmutableSet.of<number>([]).min(Orderings.normal())).to.beNull();
    });
  });

  describe('reduceItem', () => {
    should('return the correct value', () => {
      const result = ImmutableSet
          .of([1, 2, 3, 4])
          .reduceItem((prev: number, item: number) => {
            return prev + item;
          },          2);
      assert(result).to.equal(12);
    });
  });

  describe('size', () => {
    should('return the size correctly', () => {
      assert(ImmutableSet.of([1, 3]).size()).to.equal(2);
    });
  });

  describe('someItem', () => {
    should('return true if some element passes the check', () => {
      assert(ImmutableSet.of([1, 2, 3]).someItem((i: number) => i === 2)).to.beTrue();
    });

    should('return false if every element does not pass the check', () => {
      assert(ImmutableSet.of([1, 2, 3]).someItem((i: number) => i < 0)).to.beFalse();
    });
  });

  describe('sort', () => {
    should('sort the items correctly', () => {
      const orderedSet = ImmutableSet
          .of([1, 2, 3, 4])
          .sort(Orderings.reverse(Orderings.normal()));
      assert(orderedSet).to.haveElements([4, 3, 2, 1]);
    });
  });

  describe('of', () => {
    should('create the set correctly from an array', () => {
      const elements = [1, 2, 3, 4];
      const set = ImmutableSet.of(elements);
      assert(set).to.haveElements(elements);
    });

    should('create the set correctly from a set', () => {
      const elements = [1, 2, 3, 4];
      const set = ImmutableSet.of(new Set(elements));
      assert(set).to.haveElements(elements);
    });

    should('create the set correctly from finite iterable', () => {
      const elements = [1, 2, 3, 4];
      const set = ImmutableSet.of(ImmutableSet.of(elements));
      assert(set).to.haveElements(elements);
    });
  });
});

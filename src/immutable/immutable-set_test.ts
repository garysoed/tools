import { assert, TestBase } from '../test-base';
TestBase.setup();

import { ImmutableSet } from '../immutable/immutable-set';


describe('immutable.ImmutableSet', () => {
  describe('[Symbol.iterator]', () => {
    it('should list the elements correctly', () => {
      const elements = [1, 2, 3, 4];
      const set = ImmutableSet.of(elements);
      assert(set).to.haveElements(elements);
    });
  });

  describe('add', () => {
    it('should add the item correctly', () => {
      const set = ImmutableSet.of([1, 2, 3, 4]).add(5);
      assert(set).to.haveElements([1, 2, 3, 4, 5]);
    });
  });

  describe('addAll', () => {
    it('should add the items correctly', () => {
      const set = ImmutableSet.of([1, 2, 3, 4]).addAll(ImmutableSet.of([5, 6, 7]));
      assert(set).to.haveElements([1, 2, 3, 4, 5, 6, 7]);
    });
  });

  describe('delete', () => {
    it('should delete the item correctly', () => {
      const set = ImmutableSet.of([1, 2, 3, 4]).delete(3);
      assert(set).to.haveElements([1, 2, 4]);
    });
  });

  describe('deleteAll', () => {
    it('should delete the items correctly', () => {
      const set = ImmutableSet.of([1, 2, 3, 4]).deleteAll(ImmutableSet.of([1, 3]));
      assert(set).to.haveElements([2, 4]);
    });
  });

  describe('filterItem', () => {
    it('should filter the items correctly', () => {
      const set = ImmutableSet
          .of([1, 2, 3, 4])
          .filterItem((item: number) => {
            return (item % 2) === 0;
          });
      assert(set).to.haveElements([2, 4]);
    });
  });

  describe('has', () => {
    it('should return true if the item is in the set', () => {
      assert(ImmutableSet.of([1, 3]).has(1)).to.beTrue();
    });

    it('should return false if the item is not in the set', () => {
      assert(ImmutableSet.of([1, 3]).has(2)).to.beFalse();
    });
  });

  describe('mapItem', () => {
    it('should map the items correctly', () => {
      const set = ImmutableSet
          .of([1, 2, 3, 4])
          .mapItem((item: number) => {
            return `${item}`;
          });
      assert(set).to.haveElements(['1', '2', '3', '4']);
    });
  });

  describe('size', () => {
    it('should return the size correctly', () => {
      assert(ImmutableSet.of([1, 3]).size()).to.equal(2);
    });
  });

  describe('of', () => {
    it('should create the set correctly from an array', () => {
      const elements = [1, 2, 3, 4];
      const set = ImmutableSet.of(elements);
      assert(set).to.haveElements(elements);
    });

    it('should create the set correctly from a set', () => {
      const elements = [1, 2, 3, 4];
      const set = ImmutableSet.of(new Set(elements));
      assert(set).to.haveElements(elements);
    });

    it('should create the set correctly from finite iterable', () => {
      const elements = [1, 2, 3, 4];
      const set = ImmutableSet.of(ImmutableSet.of(elements));
      assert(set).to.haveElements(elements);
    });
  });
});

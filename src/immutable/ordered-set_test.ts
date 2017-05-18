import { assert, TestBase } from '../test-base';
TestBase.setup();

import { ImmutableSet } from '../immutable/immutable-set';
import { OrderedSet } from '../immutable/ordered-set';


describe('immutable.OrderedSet', () => {
  describe('[Symbol.iterator]', () => {
    it('should return the correct data', () => {
      const entries: number[] = [0, 1, 2];
      assert(OrderedSet.of(entries)).to.haveElements(entries);
    });
  });

  describe('add', () => {
    it('should add the item correctly', () => {
      const set = OrderedSet.of([0, 1, 2]).add(3);
      assert(set).to.haveElements([0, 1, 2, 3]);
    });

    it('should do nothing if the item is already in the set', () => {
      const set = OrderedSet.of([0, 1, 2]).add(1);
      assert(set).to.haveElements([0, 1, 2]);
    });
  });

  describe('addAll', () => {
    it('should add all the items correctly', () => {
      const set = OrderedSet
          .of([0, 1, 2])
          .addAll(ImmutableSet.of([3, 4]));
      assert(set).to.haveElements([0, 1, 2, 3, 4]);
    });

    it('should ignore keys that are already in the map', () => {
      const set = OrderedSet
          .of([0, 1, 2])
          .addAll(ImmutableSet.of([0, 3]));
      assert(set).to.haveElements([0, 1, 2, 3]);
    });
  });

  describe('delete', () => {
    it('should delete the item correctly', () => {
      const set = OrderedSet.of([0, 1, 2]).delete(1);
      assert(set).to.haveElements([0, 2]);
    });

    it('should do nothing if the item cannot be found', () => {
      const set = OrderedSet.of([0, 1, 2]).delete(3);
      assert(set).to.haveElements([0, 1, 2]);
    });
  });

  describe('deleteAll', () => {
    it('should delete all the items correctly', () => {
      const set = OrderedSet.of([0, 1, 2]).deleteAll(ImmutableSet.of([1, 2]));
      assert(set).to.haveElements([0]);
    });

    it('should skip items that cannot be found', () => {
      const set = OrderedSet
          .of([0, 1, 2])
          .deleteAll(ImmutableSet.of([3]));
      assert(set).to.haveElements([0, 1, 2]);
    });
  });

  describe('deleteAt', () => {
    it('should delete the item correctly', () => {
      const set = OrderedSet.of([0, 1, 2]).deleteAt(1);
      assert(set).to.haveElements([0, 2]);
    });
  });

  describe('equals', () => {
    it('should return true if the other list is the same', () => {
      assert(OrderedSet.of([1, 2, 3]).equals(OrderedSet.of([1, 2, 3]))).to.beTrue();
    });

    it('should return false if the sizes are different', () => {
      assert(OrderedSet.of([1, 2]).equals(OrderedSet.of([1, 2, 3]))).to.beFalse();
    });

    it('should return false if one of the elements are different', () => {
      assert(OrderedSet.of([1, 2, 4]).equals(OrderedSet.of([1, 2, 3]))).to.beFalse();
    });

    it('should return false if the ordering is different', () => {
      assert(OrderedSet.of([1, 3, 2]).equals(OrderedSet.of([1, 2, 3]))).to.beFalse();
    });
  });

  describe('everyItem', () => {
    it('should return true if every element passes the check', () => {
      assert(OrderedSet.of([1, 2, 3]).everyItem((i: number) => i > 0)).to.beTrue();
    });

    it('should return false if one element does not pass the check', () => {
      assert(OrderedSet.of([1, 2, 3]).everyItem((i: number) => i !== 2)).to.beFalse();
    });
  });

  describe('filterItem', () => {
    it('should filter the items correctly', () => {
      const set = OrderedSet
          .of([0, 1, 2])
          .filterItem((index: number) => (index % 2) === 0);
      assert(set).to.haveElements([0, 2]);
    });
  });

  describe('find', () => {
    it('should return the matching item', () => {
      assert(OrderedSet.of([1, 2, 3]).find((n: number) => n >= 2)).to.equal(2);
    });

    it('should return null if there are no matches', () => {
      assert(OrderedSet.of([1, 2, 3]).find((n: number) => false)).to.beNull();
    });
  });

  describe('getAt', () => {
    it('should return the correct item', () => {
      const set = OrderedSet.of([0, 1, 2]);
      assert(set.getAt(0)).to.equal(0);
      assert(set.getAt(1)).to.equal(1);
      assert(set.getAt(2)).to.equal(2);
    });
  });

  describe('has', () => {
    it('should return true if the item is in the list', () => {
      const set = OrderedSet.of([0, 1, 2]);
      assert(set.has(1)).to.beTrue();
    });

    it('should return false if the item is not in the list', () => {
      const set = OrderedSet.of([0, 1, 2]);
      assert(set.has(3)).to.beFalse();
    });
  });

  describe('insertAllAt', () => {
    it('should insert the items correctly', () => {
      const set = OrderedSet
          .of([0, 1, 2])
          .insertAllAt(1, ImmutableSet.of([3, 4]));
      assert(set).to.haveElements([0, 3, 4, 1, 2]);
    });
  });

  describe('insertAt', () => {
    it('should insert the item correctly', () => {
      const set = OrderedSet
          .of([0, 1, 2])
          .insertAt(1, 3);
      assert(set).to.haveElements([0, 3, 1, 2]);
    });
  });

  describe('mapItem', () => {
    it('should map the items correctly', () => {
      const set = OrderedSet
          .of([0, 1, 2])
          .mapItem((key: number) => `${key}`);
      assert(set).to.haveElements(['0', '1', '2']);
    });
  });

  describe('reduceItem', () => {
    it('should return the correct value', () => {
      const result = OrderedSet
          .of([1, 2, 3, 4])
          .reduceItem((prev: number, item: number) => {
            return prev + item;
          }, 2);
      assert(result).to.equal(12);
    });
  });

  describe('reverse', () => {
    it('should return the correct elements', () => {
      const entries: number[] = [0, 1, 2];
      assert(OrderedSet.of(entries).reverse()).to.haveElements([2, 1, 0]);
    });
  });

  describe('setAt', () => {
    it('should set the item correctly', () => {
      const map = OrderedSet
          .of([0, 1, 2])
          .setAt(1, 3);
      assert(map).to.haveElements([0, 3, 2]);
    });
  });

  describe('size', () => {
    it('should return the correct length', () => {
      assert(OrderedSet.of([0, 1, 2]).size()).to.equal(3);
    });
  });

  describe('someItem', () => {
    it('should return true if some element passes the check', () => {
      assert(OrderedSet.of([1, 2, 3]).someItem((i: number) => i === 2)).to.beTrue();
    });

    it('should return false if every element does not pass the check', () => {
      assert(OrderedSet.of([1, 2, 3]).someItem((i: number) => i < 0)).to.beFalse();
    });
  });

  describe('sort', () => {
    it('should sort the items correctly', () => {
      const map = OrderedSet
          .of([0, 1, 2])
          .sort((item1: number, item2: number) => {
            if (item1 > item2) {
              return -1;
            } else if (item2 > item1) {
              return 1;
            } else {
              return 0;
            }
          });
      assert(map).to.haveElements([2, 1, 0]);
    });
  });

  describe('of', () => {
    it('should create the map correctly from entries array', () => {
      const entries: number[] = [0, 1, 2];
      assert(OrderedSet.of(entries)).to.haveElements(entries);
    });

    it('should dedupe entries', () => {
      const entries: number[] = [0, 1, 2, 2];
      assert(OrderedSet.of(entries)).to.haveElements([0, 1, 2]);
    });
  });
});

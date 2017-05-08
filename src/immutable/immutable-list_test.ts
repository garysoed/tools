import { assert, TestBase } from '../test-base';
TestBase.setup();

import { ImmutableList } from '../immutable/immutable-list';
import { ImmutableSet } from '../immutable/immutable-set';


describe('immutable.ImmutableList', () => {
  describe('[Symbol.iterator]', () => {
    it('should return the correct data', () => {
      assert(ImmutableList.of([1, 2, 3, 4])).to.haveElements([1, 2, 3, 4]);
    });
  });

  describe('add', () => {
    it('should add the item correctly', () => {
      assert(ImmutableList.of([1, 2, 3, 4]).add(5)).to.haveElements([1, 2, 3, 4, 5]);
    });
  });

  describe('addAll', () => {
    it('should add all the items correctly', () => {
      const list = ImmutableList.of([1, 2, 3, 4]).addAll(ImmutableSet.of([5, 6]));
      assert(list).to.haveElements([1, 2, 3, 4, 5, 6]);
    });
  });

  describe('delete', () => {
    it('should delete the item correctly', () => {
      assert(ImmutableList.of([1, 2, 3, 4]).delete(2)).to.haveElements([1, 3, 4]);
    });

    it('should do nothing if the item cannot be found', () => {
      assert(ImmutableList.of([1, 2, 3, 4]).delete(5)).to.haveElements([1, 2, 3, 4]);
    });
  });

  describe('deleteAll', () => {
    it('should delete all the items correctly', () => {
      const list = ImmutableList.of([1, 2, 3, 4]).deleteAll(ImmutableSet.of([2, 3]));
      assert(list).to.haveElements([1, 4]);
    });
  });

  describe('deleteAllKeys', () => {
    it('should delete all the items correctly', () => {
      const list = ImmutableList.of([1, 2, 3, 4]).deleteAllKeys(ImmutableSet.of([1, 2]));
      assert(list).to.haveElements([1, 4]);
    });
  });

  describe('deleteAt', () => {
    it('should delete the item correctly', () => {
      assert(ImmutableList.of([1, 2, 3, 4]).deleteAt(1)).to.haveElements([1, 3, 4]);
    });

    it('should do nothing if the item cannot be found', () => {
      assert(ImmutableList.of([1, 2, 3, 4]).deleteAt(5)).to.haveElements([1, 2, 3, 4]);
    });
  });

  describe('deleteKey', () => {
    it('should delete the item correctly', () => {
      assert(ImmutableList.of([1, 2, 3, 4]).deleteKey(1)).to.haveElements([1, 3, 4]);
    });

    it('should do nothing if the item cannot be found', () => {
      assert(ImmutableList.of([1, 2, 3, 4]).deleteKey(5)).to.haveElements([1, 2, 3, 4]);
    });
  });

  describe('entries', () => {
    it('should return the correct data', () => {
      assert(ImmutableList.of([1, 2, 3]).entries()).to.haveElements([[0, 1], [1, 2], [2, 3]]);
    });
  });

  describe('filter', () => {
    it('should filter the items correctly', () => {
      const list = ImmutableList.of([1, 2, 3, 4])
          .filter((item: number) => (item % 2) === 0);
      assert(list).to.haveElements([2, 4]);
    });
  });

  describe('filterItem', () => {
    it('should filter the items correctly', () => {
      const list = ImmutableList.of([1, 2, 3, 4])
          .filterItem((item: number) => (item % 2) === 0);
      assert(list).to.haveElements([2, 4]);
    });
  });

  describe('get', () => {
    it('should return the correct item', () => {
      const list = ImmutableList.of([1, 2, 3, 4]);
      assert(list.get(0)).to.equal(1);
      assert(list.get(1)).to.equal(2);
      assert(list.get(2)).to.equal(3);
      assert(list.get(3)).to.equal(4);
    });
  });

  describe('getAt', () => {
    it('should return the correct item', () => {
      const list = ImmutableList.of([1, 2, 3, 4]);
      assert(list.getAt(0)).to.equal(1);
      assert(list.getAt(1)).to.equal(2);
      assert(list.getAt(2)).to.equal(3);
      assert(list.getAt(3)).to.equal(4);
    });
  });

  describe('has', () => {
    it('should return true if the item is in the list', () => {
      assert(ImmutableList.of([1, 2, 3]).has(2)).to.beTrue();
    });

    it('should return false if the item is not in the list', () => {
      assert(ImmutableList.of([1, 2, 3]).has(4)).to.beFalse();
    });
  });

  describe('hasKey', () => {
    it('should return true if the item is in the list', () => {
      assert(ImmutableList.of([1, 2, 3]).hasKey(1)).to.beTrue();
    });

    it('should return false if the item is not in the list', () => {
      assert(ImmutableList.of([1, 2, 3]).hasKey(4)).to.beFalse();
    });
  });

  describe('insertAllAt', () => {
    it('should insert the items correctly', () => {
      const list = ImmutableList.of([1, 2, 3]).insertAllAt(1, ImmutableSet.of([4, 5]));
      assert(list).to.haveElements([1, 4, 5, 2, 3]);
    });
  });

  describe('insertAt', () => {
    it('should insert the item correctly', () => {
      const list = ImmutableList.of([1, 2, 3]).insertAt(1, 4);
      assert(list).to.haveElements([1, 4, 2, 3]);
    });
  });

  describe('keys', () => {
    it('should return the correct keys', () => {
      assert(ImmutableList.of([1, 4, 2, 3]).keys()).to.haveElements([0, 1, 2, 3]);
    });
  });

  describe('map', () => {
    it('should map the items correctly', () => {
      const list = ImmutableList
          .of([1, 2, 3, 4])
          .map((value: number, index: number) => value + index);
      assert(list).to.haveElements([1, 3, 5, 7]);
    });
  });

  describe('mapItem', () => {
    it('should map the items correctly', () => {
      const list = ImmutableList
          .of([1, 2, 3, 4])
          .mapItem((index: number) => `${index}`);
      assert(list).to.haveElements(['1', '2', '3', '4']);
    });
  });

  describe('set', () => {
    it('should set the item correctly', () => {
      assert(ImmutableList.of([1, 2, 3, 4]).set(1, 5)).to.haveElements([1, 5, 3, 4]);
    });
  });

  describe('setAt', () => {
    it('should set the item correctly', () => {
      assert(ImmutableList.of([1, 2, 3, 4]).setAt(1, 5)).to.haveElements([1, 5, 3, 4]);
    });
  });

  describe('size', () => {
    it('should return the correct length', () => {
      assert(ImmutableList.of([1, 2, 3, 4]).size()).to.equal(4);
    });
  });

  describe('sort', () => {
    it('should sort the items correctly', () => {
      const list = ImmutableList
          .of([1, 2, 3, 4])
          .sort((item1: number, item2: number) => {
            if (item1 > item2) {
              return -1;
            } else if (item2 > item1) {
              return 1;
            } else {
              return 0;
            }
          });
      assert(list).to.haveElements([4, 3, 2, 1]);
    });
  });

  describe('values', () => {
    it('should return the correct data', () => {
      assert(ImmutableList.of([1, 2, 3, 4]).values()).to.haveElements([1, 2, 3, 4]);
    });
  });
});

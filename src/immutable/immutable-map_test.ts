import { assert, TestBase } from '../test-base';
TestBase.setup();

import { ImmutableList } from '../immutable/immutable-list';
import { ImmutableMap } from '../immutable/immutable-map';
import { ImmutableSet } from '../immutable/immutable-set';


describe('immutable.ImmutableMap', () => {
  describe('[Symbol.iterator]', () => {
    it('should return the correct data', () => {
      const entries: [number, string][] = [[0, 'a'], [1, 'b'], [2, 'c']];
      assert(ImmutableMap.of(entries)).to.haveElements(entries);
    });
  });

  describe('add', () => {
    it('should add the item correctly', () => {
      const map = ImmutableMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']])
          .add([3, 'd']);
      assert(map).to.haveElements([[0, 'a'], [1, 'b'], [2, 'c'], [3, 'd']]);
    });
  });

  describe('addAll', () => {
    it('should add all the items correctly', () => {
      const map = ImmutableMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']])
          .addAll(ImmutableSet.of<[number, string]>([[3, 'd'], [4, 'e']]));
      assert(map).to.haveElements([[0, 'a'], [1, 'b'], [2, 'c'], [3, 'd'], [4, 'e']]);
    });
  });

  describe('delete', () => {
    it('should delete the item correctly', () => {
      const toDelete: [number, string] = [1, 'b'];
      const map = ImmutableMap.of([[0, 'a'], toDelete, [2, 'c']]).delete(toDelete);
      assert(map).to.haveElements([[0, 'a'], [2, 'c']]);
    });

    it('should do nothing if the item cannot be found', () => {
      const map = ImmutableMap.of([[0, 'a'], [1, 'b'], [2, 'c']]).delete([3, 'd']);
      assert(map).to.haveElements([[0, 'a'], [1, 'b'], [2, 'c']]);
    });
  });

  describe('deleteAll', () => {
    it('should delete all the items correctly', () => {
      const toDelete1: [number, string] = [1, 'b'];
      const toDelete2: [number, string] = [2, 'c'];
      const map = ImmutableMap
          .of([[0, 'a'], toDelete1, toDelete2])
          .deleteAll(ImmutableSet.of([toDelete1, toDelete2]));
      assert(map).to.haveElements([[0, 'a']]);
    });
  });

  describe('deleteAllKeys', () => {
    it('should delete all the items correctly', () => {
      const map = ImmutableMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']])
          .deleteAllKeys(ImmutableSet.of([1, 2]));
      assert(map).to.haveElements([[0, 'a']]);
    });
  });

  describe('deleteKey', () => {
    it('should delete the item correctly', () => {
      const map = ImmutableMap.of([[0, 'a'], [1, 'b'], [2, 'c']]).deleteKey(1);
      assert(map).to.haveElements([[0, 'a'], [2, 'c']]);
    });

    it('should do nothing if the item cannot be found', () => {
      const map = ImmutableMap.of([[0, 'a'], [1, 'b'], [2, 'c']]).deleteKey(4);
      assert(map).to.haveElements([[0, 'a'], [1, 'b'], [2, 'c']]);
    });
  });

  describe('entries', () => {
    it('should return the correct data', () => {
      const entries: [number, string][] = [[0, 'a'], [1, 'b'], [2, 'c']];
      assert(ImmutableMap.of(entries).entries()).to.haveElements(entries);
    });
  });

  describe('every', () => {
    it('should return true if every entry passes the check', () => {
      const map = ImmutableMap.of([[1, 'a'], [2, 'b'], [3, 'c']]);
      assert(map.every((value: string, key: number) => key > 0)).to.beTrue();
    });

    it('should return false if one entry does not pass the check', () => {
      const map = ImmutableMap.of([[1, 'a'], [2, 'b'], [3, 'c']]);
      assert(map.every((value: string, key: number) => key !== 2)).to.beFalse();
    });
  });

  describe('everyItem', () => {
    it('should return true if every entry passes the check', () => {
      const map = ImmutableMap.of([[1, 'a'], [2, 'b'], [3, 'c']]);
      assert(map.everyItem(([key, value]: [number, string]) => key > 0)).to.beTrue();
    });

    it('should return false if one entry does not pass the check', () => {
      const map = ImmutableMap.of([[1, 'a'], [2, 'b'], [3, 'c']]);
      assert(map.everyItem(([key, value]: [number, string]) => key !== 2)).to.beFalse();
    });
  });

  describe('filter', () => {
    it('should filter the items correctly', () => {
      const map = ImmutableMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']])
          .filter((value: string, index: number) => (index % 2) === 0);
      assert(map).to.haveElements([[0, 'a'], [2, 'c']]);
    });
  });

  describe('filterItem', () => {
    it('should filter the items correctly', () => {
      const map = ImmutableMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']])
          .filterItem(([index, value]: [number, string]) => (index % 2) === 0);
      assert(map).to.haveElements([[0, 'a'], [2, 'c']]);
    });
  });

  describe('get', () => {
    it('should return the correct item', () => {
      const map = ImmutableMap.of([[0, 'a'], [1, 'b'], [2, 'c']]);
      assert(map.get(0)).to.equal('a');
      assert(map.get(1)).to.equal('b');
      assert(map.get(2)).to.equal('c');
    });
  });

  describe('has', () => {
    it('should return true if the item is in the list', () => {
      const entry: [number, string] = [1, 'b'];
      const map = ImmutableMap.of([[0, 'a'], entry, [2, 'c']]);
      assert(map.has(entry)).to.beTrue();
    });

    it('should return false if the item is not in the list', () => {
      const map = ImmutableMap.of([[0, 'a'], [1, 'b'], [2, 'c']]);
      assert(map.has([3, 'd'])).to.beFalse();
    });
  });

  describe('hasKey', () => {
    it('should return true if the item is in the list', () => {
      const map = ImmutableMap.of([[0, 'a'], [1, 'b'], [2, 'c']]);
      assert(map.hasKey(1)).to.beTrue();
    });

    it('should return false if the item is not in the list', () => {
      const map = ImmutableMap.of([[0, 'a'], [1, 'b'], [2, 'c']]);
      assert(map.hasKey(4)).to.beFalse();
    });
  });

  describe('keys', () => {
    it('should return the correct keys', () => {
      const entries: [number, string][] = [[0, 'a'], [1, 'b'], [2, 'c']];
      assert(ImmutableMap.of(entries).keys()).to.haveElements([0, 1, 2]);
    });
  });

  describe('map', () => {
    it('should map the items correctly', () => {
      const map = ImmutableMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']])
          .map((value: string, key: number) => `${key}${value}`);
      assert(map).to.haveElements([[0, '0a'], [1, '1b'], [2, '2c']]);
    });
  });

  describe('mapItem', () => {
    it('should map the items correctly', () => {
      const map = ImmutableMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']])
          .mapItem(([key, value]: [number, string]) => `${key}${value}`);
      assert(map).to.haveElements([[0, '0a'], [1, '1b'], [2, '2c']]);
    });
  });

  describe('reduce', () => {
    it('should return the correct value', () => {
      const result = ImmutableMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']] as [number, string][])
          .reduce((prev: string, index: string, key: number) => {
            return `${prev},${key}${index}`;
          }, '@');
      assert(result).to.equal(`@,0a,1b,2c`);
    });
  });

  describe('reduceItem', () => {
    it('should return the correct value', () => {
      const result = ImmutableMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']] as [number, string][])
          .reduceItem((prev: string, [key, index]: [number, string]) => {
            return `${prev},${key}${index}`;
          }, '@');
      assert(result).to.equal(`@,0a,1b,2c`);
    });
  });

  describe('set', () => {
    it('should set the item correctly', () => {
      const map = ImmutableMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']])
          .set(1, 'blah');
      assert(map).to.haveElements([[0, 'a'], [1, 'blah'], [2, 'c']]);
    });
  });

  describe('size', () => {
    it('should return the correct length', () => {
      assert(ImmutableMap.of([[0, 'a'], [1, 'b'], [2, 'c']]).size()).to.equal(3);
    });
  });

  describe('some', () => {
    it('should return true if some element passes the check', () => {
      const map = ImmutableMap.of([[1, 'a'], [2, 'b'], [3, 'c']]);
      assert(map.some((value: string, key: number) => key === 2)).to.beTrue();
    });

    it('should return false if every element does not pass the check', () => {
      const map = ImmutableMap.of([[1, 'a'], [2, 'b'], [3, 'c']]);
      assert(map.some((value: string, key: number) => key < 0)).to.beFalse();
    });
  });

  describe('someItem', () => {
    it('should return true if some element passes the check', () => {
      const map = ImmutableMap.of([[1, 'a'], [2, 'b'], [3, 'c']]);
      assert(map.someItem(([key, value]: [number, string]) => key === 2)).to.beTrue();
    });

    it('should return false if every element does not pass the check', () => {
      const map = ImmutableMap.of([[1, 'a'], [2, 'b'], [3, 'c']]);
      assert(map.someItem(([key, value]: [number, string]) => key < 0)).to.beFalse();
    });
  });

  describe('values', () => {
    it('should return the correct data', () => {
      const entries: [number, string][] = [[0, 'a'], [1, 'b'], [2, 'c']];
      assert(ImmutableMap.of(entries).values()).to.haveElements(['a', 'b', 'c']);
    });
  });

  describe('of', () => {
    it('should create the map correctly from finite iterable', () => {
      const entries: [number, string][] = [[0, 'a'], [1, 'b'], [2, 'c']];
      assert(ImmutableMap.of(ImmutableMap.of(entries))).to.haveElements(entries);
    });

    it('should create the map correctly from entries array', () => {
      const entries: [number, string][] = [[0, 'a'], [1, 'b'], [2, 'c']];
      assert(ImmutableMap.of(entries)).to.haveElements(entries);
    });

    it('should create the map correctly from map', () => {
      const entries: [number, string][] = [[0, 'a'], [1, 'b'], [2, 'c']];
      assert(ImmutableMap.of(new Map(entries))).to.haveElements(entries);
    });

    it('should create the map correctly from JSON', () => {
      assert(ImmutableMap.of({a: 1, b: 2, c: 3})).to.haveElements([['a', 1], ['b', 2], ['c', 3]]);
    });
  });
});

import { assert, TestBase } from 'gs-testing/export/main';
TestBase.setup();

import { StringType, TupleOfType } from '../check';
import { ImmutableMap } from '../immutable/immutable-map';
import { ImmutableSet } from '../immutable/immutable-set';
import { Orderings } from '../immutable/orderings';


describe('immutable.ImmutableMap', () => {
  describe('[Symbol.iterator]', () => {
    should('return the correct data', () => {
      const entries: [number, string][] = [[0, 'a'], [1, 'b'], [2, 'c']];
      assert(ImmutableMap.of(entries)).to.haveElements(entries);
    });
  });

  describe('add', () => {
    should('add the item correctly', () => {
      const map = ImmutableMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']])
          .add([3, 'd']);
      assert(map).to.haveElements([[0, 'a'], [1, 'b'], [2, 'c'], [3, 'd']]);
    });
  });

  describe('addAll', () => {
    should('add all the items correctly', () => {
      const map = ImmutableMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']])
          .addAll(ImmutableSet.of<[number, string]>([[3, 'd'], [4, 'e']]));
      assert(map).to.haveElements([[0, 'a'], [1, 'b'], [2, 'c'], [3, 'd'], [4, 'e']]);
    });
  });

  describe('delete', () => {
    should('delete the item correctly', () => {
      const toDelete: [number, string] = [1, 'b'];
      const map = ImmutableMap.of([[0, 'a'], toDelete, [2, 'c']]).delete(toDelete);
      assert(map).to.haveElements([[0, 'a'], [2, 'c']]);
    });

    should('do nothing if the item cannot be found', () => {
      const map = ImmutableMap.of([[0, 'a'], [1, 'b'], [2, 'c']]).delete([3, 'd']);
      assert(map).to.haveElements([[0, 'a'], [1, 'b'], [2, 'c']]);
    });
  });

  describe('deleteAll', () => {
    should('delete all the items correctly', () => {
      const toDelete1: [number, string] = [1, 'b'];
      const toDelete2: [number, string] = [2, 'c'];
      const map = ImmutableMap
          .of([[0, 'a'], toDelete1, toDelete2])
          .deleteAll(ImmutableSet.of([toDelete1, toDelete2]));
      assert(map).to.haveElements([[0, 'a']]);
    });
  });

  describe('deleteAllKeys', () => {
    should('delete all the items correctly', () => {
      const map = ImmutableMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']])
          .deleteAllKeys(ImmutableSet.of([1, 2]));
      assert(map).to.haveElements([[0, 'a']]);
    });
  });

  describe('deleteKey', () => {
    should('delete the item correctly', () => {
      const map = ImmutableMap.of([[0, 'a'], [1, 'b'], [2, 'c']]).deleteKey(1);
      assert(map).to.haveElements([[0, 'a'], [2, 'c']]);
    });

    should('do nothing if the item cannot be found', () => {
      const map = ImmutableMap.of([[0, 'a'], [1, 'b'], [2, 'c']]).deleteKey(4);
      assert(map).to.haveElements([[0, 'a'], [1, 'b'], [2, 'c']]);
    });
  });

  describe('entries', () => {
    should('return the correct data', () => {
      const entries: [number, string][] = [[0, 'a'], [1, 'b'], [2, 'c']];
      assert(ImmutableMap.of(entries).entries()).to.haveElements(entries);
    });
  });

  describe('every', () => {
    should('return true if every entry passes the check', () => {
      const map = ImmutableMap.of([[1, 'a'], [2, 'b'], [3, 'c']]);
      assert(map.every((_: string, key: number) => key > 0)).to.beTrue();
    });

    should('return false if one entry does not pass the check', () => {
      const map = ImmutableMap.of([[1, 'a'], [2, 'b'], [3, 'c']]);
      assert(map.every((_: string, key: number) => key !== 2)).to.beFalse();
    });
  });

  describe('everyItem', () => {
    should('return true if every entry passes the check', () => {
      const map = ImmutableMap.of([[1, 'a'], [2, 'b'], [3, 'c']]);
      assert(map.everyItem(([key, _]: [number, string]) => key > 0)).to.beTrue();
    });

    should('return false if one entry does not pass the check', () => {
      const map = ImmutableMap.of([[1, 'a'], [2, 'b'], [3, 'c']]);
      assert(map.everyItem(([key, _]: [number, string]) => key !== 2)).to.beFalse();
    });
  });

  describe('filter', () => {
    should('filter the items correctly', () => {
      const map = ImmutableMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']])
          .filter((_: string, index: number) => (index % 2) === 0);
      assert(map).to.haveElements([[0, 'a'], [2, 'c']]);
    });
  });

  describe('filterByType', () => {
    should('filter the items correctly', () => {
      const map = ImmutableMap
          .of([[0, 'a'], ['1', 'b'], ['2', 'c']])
          .filterByType(TupleOfType([StringType, StringType]));
      assert(map).to.haveElements([['1', 'b'], ['2', 'c']]);
    });
  });

  describe('filterItem', () => {
    should('filter the items correctly', () => {
      const map = ImmutableMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']])
          .filterItem(([index, _]: [number, string]) => (index % 2) === 0);
      assert(map).to.haveElements([[0, 'a'], [2, 'c']]);
    });
  });

  describe('find', () => {
    should('return the first matching entry in the map', () => {
      const entry = ImmutableMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']])
          .find(([key, _]: [number, string]) => {
            return key >= 1;
          });
      assert(entry).to.equal([1, 'b']);
    });

    should('return null if the entry is not in the map', () => {
      const entry = ImmutableMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']])
          .find(() => false);
      assert(entry).to.beNull();
    });
  });

  describe('findEntry', () => {
    should('return the first matching entry in the map', () => {
      const entry = ImmutableMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']])
          .findEntry((_: string, key: number) => {
            return key >= 1;
          });
      assert(entry).to.equal([1, 'b']);
    });

    should('return null if the entry is not in the map', () => {
      const entry = ImmutableMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']])
          .findEntry(() => false);
      assert(entry).to.beNull();
    });
  });

  describe('findKey', () => {
    should('return the first matching entry in the map', () => {
      const entry = ImmutableMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']])
          .findKey((_: string, key: number) => {
            return key >= 1;
          });
      assert(entry).to.equal(1);
    });

    should('return null if the entry is not in the map', () => {
      const entry = ImmutableMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']])
          .findKey(() => false);
      assert(entry).to.beNull();
    });
  });

  describe('findValue', () => {
    should('return the first matching entry in the map', () => {
      const entry = ImmutableMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']])
          .findValue((_: string, key: number) => {
            return key >= 1;
          });
      assert(entry).to.equal('b');
    });

    should('return null if the entry is not in the map', () => {
      const entry = ImmutableMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']])
          .findValue(() => false);
      assert(entry).to.beNull();
    });
  });

  describe('get', () => {
    should('return the correct item', () => {
      const map = ImmutableMap.of([[0, 'a'], [1, 'b'], [2, 'c']]);
      assert(map.get(0)).to.equal('a');
      assert(map.get(1)).to.equal('b');
      assert(map.get(2)).to.equal('c');
    });
  });

  describe('has', () => {
    should('return true if the item is in the map', () => {
      const entry: [number, string] = [1, 'b'];
      const map = ImmutableMap.of([[0, 'a'], entry, [2, 'c']]);
      assert(map.has(entry)).to.beTrue();
    });

    should('return false if the item is not in the map', () => {
      const map = ImmutableMap.of([[0, 'a'], [1, 'b'], [2, 'c']]);
      assert(map.has([3, 'd'])).to.beFalse();
    });
  });

  describe('hasKey', () => {
    should('return true if the item is in the map', () => {
      const map = ImmutableMap.of([[0, 'a'], [1, 'b'], [2, 'c']]);
      assert(map.hasKey(1)).to.beTrue();
    });

    should('return false if the item is not in the map', () => {
      const map = ImmutableMap.of([[0, 'a'], [1, 'b'], [2, 'c']]);
      assert(map.hasKey(4)).to.beFalse();
    });
  });

  describe('keys', () => {
    should('return the correct keys', () => {
      const entries: [number, string][] = [[0, 'a'], [1, 'b'], [2, 'c']];
      assert(ImmutableMap.of(entries).keys()).to.haveElements([0, 1, 2]);
    });
  });

  describe('map', () => {
    should('map the items correctly', () => {
      const map = ImmutableMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']])
          .map((value: string, key: number) => `${key}${value}`);
      assert(map).to.haveElements([[0, '0a'], [1, '1b'], [2, '2c']]);
    });
  });

  describe('mapItem', () => {
    should('map the items correctly', () => {
      const map = ImmutableMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']])
          .mapItem(([key, value]: [number, string]) => `${key}${value}`);
      assert(map).to.haveElements(['0a', '1b', '2c']);
    });
  });

  describe('max', () => {
    should(`return the correct max item`, () => {
      const max = ImmutableMap
          .of([[-1, 1], [0, 2], [1, 3], [2, 1]])
          .max(([key1, value1]: [number, number], [key2, value2]: [number, number]) => {
            return Orderings.normal()(key1 + value1, key2 + value2);
          });
      assert(max).to.equal([1, 3]);
    });

    should(`return null if the list is null`, () => {
      assert(ImmutableMap.of<number, number>([]).max(Orderings.normal())).to.beNull();
    });
  });

  describe('min', () => {
    should(`return the correct min item`, () => {
      const min = ImmutableMap
          .of([[1, 3], [0, 2], [-1, 1], [2, 1]])
          .min(([key1, value1]: [number, number], [key2, value2]: [number, number]) => {
            return Orderings.normal()(key1 + value1, key2 + value2);
          });
      assert(min).to.equal([-1, 1]);
    });

    should(`return null if the list is null`, () => {
      assert(ImmutableMap.of<number, number>([]).min(Orderings.normal())).to.beNull();
    });
  });

  describe('reduce', () => {
    should('return the correct value', () => {
      const result = ImmutableMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']] as [number, string][])
          .reduce((prev: string, index: string, key: number) => {
            return `${prev},${key}${index}`;
          }, '@');
      assert(result).to.equal(`@,0a,1b,2c`);
    });
  });

  describe('reduceItem', () => {
    should('return the correct value', () => {
      const result = ImmutableMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']] as [number, string][])
          .reduceItem((prev: string, [key, index]: [number, string]) => {
            return `${prev},${key}${index}`;
          }, '@');
      assert(result).to.equal(`@,0a,1b,2c`);
    });
  });

  describe('set', () => {
    should('set the item correctly', () => {
      const map = ImmutableMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']])
          .set(1, 'blah');
      assert(map).to.haveElements([[0, 'a'], [1, 'blah'], [2, 'c']]);
    });
  });

  describe('size', () => {
    should('return the correct length', () => {
      assert(ImmutableMap.of([[0, 'a'], [1, 'b'], [2, 'c']]).size()).to.equal(3);
    });
  });

  describe('some', () => {
    should('return true if some element passes the check', () => {
      const map = ImmutableMap.of([[1, 'a'], [2, 'b'], [3, 'c']]);
      assert(map.some((_: string, key: number) => key === 2)).to.beTrue();
    });

    should('return false if every element does not pass the check', () => {
      const map = ImmutableMap.of([[1, 'a'], [2, 'b'], [3, 'c']]);
      assert(map.some((_: string, key: number) => key < 0)).to.beFalse();
    });
  });

  describe('someItem', () => {
    should('return true if some element passes the check', () => {
      const map = ImmutableMap.of([[1, 'a'], [2, 'b'], [3, 'c']]);
      assert(map.someItem(([key, _]: [number, string]) => key === 2)).to.beTrue();
    });

    should('return false if every element does not pass the check', () => {
      const map = ImmutableMap.of([[1, 'a'], [2, 'b'], [3, 'c']]);
      assert(map.someItem(([key, _]: [number, string]) => key < 0)).to.beFalse();
    });
  });

  describe('sort', () => {
    should('sort the items correctly', () => {
      const orderedSet = ImmutableMap
          .of([[-1, 1], [0, 2], [1, 2], [3, 1]])
          .sort(([key1, value1]: [number, number], [key2, value2]: [number, number]) => {
            return Orderings.reverse(Orderings.normal())(key1 + value1, key2 + value2);
          });
      assert(orderedSet).to.haveElements([[3, 1], [1, 2], [0, 2], [-1, 1]]);
    });
  });

  describe('values', () => {
    should('return the correct data', () => {
      const entries: [number, string][] = [[0, 'a'], [1, 'b'], [2, 'c']];
      assert(ImmutableMap.of(entries).values()).to.haveElements(['a', 'b', 'c']);
    });
  });

  describe('of', () => {
    should('create the map correctly from finite iterable', () => {
      const entries: [number, string][] = [[0, 'a'], [1, 'b'], [2, 'c']];
      assert(ImmutableMap.of(ImmutableMap.of(entries))).to.haveElements(entries);
    });

    should('create the map correctly from entries array', () => {
      const entries: [number, string][] = [[0, 'a'], [1, 'b'], [2, 'c']];
      assert(ImmutableMap.of(entries)).to.haveElements(entries);
    });

    should('create the map correctly from map', () => {
      const entries: [number, string][] = [[0, 'a'], [1, 'b'], [2, 'c']];
      assert(ImmutableMap.of(new Map(entries))).to.haveElements(entries);
    });

    should('create the map correctly from JSON', () => {
      assert(ImmutableMap.of({a: 1, b: 2, c: 3})).to.haveElements([['a', 1], ['b', 2], ['c', 3]]);
    });
  });
});

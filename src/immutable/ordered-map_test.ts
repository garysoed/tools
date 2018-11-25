import { assert, match, should, test } from 'gs-testing/export/main';
import { StringType, TupleOfType } from 'gs-types/export';
import { ImmutableSet } from '../immutable/immutable-set';
import { OrderedMap } from '../immutable/ordered-map';
import { Orderings } from '../immutable/orderings';


test('immutable.OrderedMap', () => {
  test('[Symbol.iterator]', () => {
    should('return the correct data', () => {
      assert(OrderedMap.of([[0, 'a'], [1, 'b'], [2, 'c']])).to.haveElements([
        match.anyTupleThat<[number, string]>().haveExactElements([0, 'a']),
        match.anyTupleThat<[number, string]>().haveExactElements([1, 'b']),
        match.anyTupleThat<[number, string]>().haveExactElements([2, 'c']),
      ]);
    });
  });

  test('add', () => {
    should('add the item correctly', () => {
      const map = OrderedMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']])
          .add([3, 'd']);
      assert(map).to.haveElements([
        match.anyTupleThat<[number, string]>().haveExactElements([0, 'a']),
        match.anyTupleThat<[number, string]>().haveExactElements([1, 'b']),
        match.anyTupleThat<[number, string]>().haveExactElements([2, 'c']),
        match.anyTupleThat<[number, string]>().haveExactElements([3, 'd']),
      ]);
    });

    should('do nothing if the key is already in the map', () => {
      const map = OrderedMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']])
          .add([1, 'd']);
      assert(map).to.haveElements([
        match.anyTupleThat<[number, string]>().haveExactElements([0, 'a']),
        match.anyTupleThat<[number, string]>().haveExactElements([1, 'b']),
        match.anyTupleThat<[number, string]>().haveExactElements([2, 'c']),
      ]);
    });
  });

  test('addAll', () => {
    should('add all the items correctly', () => {
      const map = OrderedMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']])
          .addAll(ImmutableSet.of<[number, string]>([[3, 'd'], [4, 'e']]));

      assert(map).to.haveElements([
        match.anyTupleThat<[number, string]>().haveExactElements([0, 'a']),
        match.anyTupleThat<[number, string]>().haveExactElements([1, 'b']),
        match.anyTupleThat<[number, string]>().haveExactElements([2, 'c']),
        match.anyTupleThat<[number, string]>().haveExactElements([3, 'd']),
        match.anyTupleThat<[number, string]>().haveExactElements([4, 'e']),
      ]);
    });

    should('ignore keys that are already in the map', () => {
      const map = OrderedMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']])
          .addAll(ImmutableSet.of<[number, string]>([[0, 'blah'], [3, 'd']]));

      assert(map).to.haveElements([
        match.anyTupleThat<[number, string]>().haveExactElements([0, 'a']),
        match.anyTupleThat<[number, string]>().haveExactElements([1, 'b']),
        match.anyTupleThat<[number, string]>().haveExactElements([2, 'c']),
        match.anyTupleThat<[number, string]>().haveExactElements([3, 'd']),
      ]);
    });
  });

  test('delete', () => {
    should('delete the item correctly', () => {
      const toDelete: [number, string] = [1, 'b'];
      const map = OrderedMap.of([[0, 'a'], toDelete, [2, 'c']]).delete(toDelete);

      assert(map).to.haveElements([
        match.anyTupleThat<[number, string]>().haveExactElements([0, 'a']),
        match.anyTupleThat<[number, string]>().haveExactElements([2, 'c']),
      ]);
    });

    should('do nothing if the item cannot be found', () => {
      const map = OrderedMap.of([[0, 'a'], [1, 'b'], [2, 'c']]).delete([3, 'd']);
      assert(map).to.haveElements([
        match.anyTupleThat<[number, string]>().haveExactElements([0, 'a']),
        match.anyTupleThat<[number, string]>().haveExactElements([1, 'b']),
        match.anyTupleThat<[number, string]>().haveExactElements([2, 'c']),
      ]);
    });

    should('do nothing if the item have the same key but different values', () => {
      const map = OrderedMap.of([[0, 'a'], [1, 'b'], [2, 'c']]).delete([2, 'd']);
      assert(map).to.haveElements([
        match.anyTupleThat<[number, string]>().haveExactElements([0, 'a']),
        match.anyTupleThat<[number, string]>().haveExactElements([1, 'b']),
        match.anyTupleThat<[number, string]>().haveExactElements([2, 'c']),
      ]);
    });
  });

  test('deleteAll', () => {
    should('delete all the items correctly', () => {
      const toDelete1: [number, string] = [1, 'b'];
      const toDelete2: [number, string] = [2, 'c'];
      const map = OrderedMap
          .of([[0, 'a'], toDelete1, toDelete2])
          .deleteAll(ImmutableSet.of([toDelete1, toDelete2]));
      assert(map).to.haveElements([
        match.anyTupleThat<[number, string]>().haveExactElements([0, 'a']),
      ]);
    });

    should('skip items whose key cannot be found', () => {
      const map = OrderedMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']])
          .deleteAll(ImmutableSet.of([[3, 'd'] as [number, string]]));
      assert(map).to.haveElements([
        match.anyTupleThat<[number, string]>().haveExactElements([0, 'a']),
        match.anyTupleThat<[number, string]>().haveExactElements([1, 'b']),
        match.anyTupleThat<[number, string]>().haveExactElements([2, 'c']),
      ]);
    });

    should('skip items that have an existing key but different value', () => {
      const map = OrderedMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']])
          .deleteAll(ImmutableSet.of([[2, 'd'] as [number, string]]));
      assert(map).to.haveElements([
        match.anyTupleThat<[number, string]>().haveExactElements([0, 'a']),
        match.anyTupleThat<[number, string]>().haveExactElements([1, 'b']),
        match.anyTupleThat<[number, string]>().haveExactElements([2, 'c']),
      ]);
    });
  });

  test('deleteAllKeys', () => {
    should('delete all the items correctly', () => {
      const map = OrderedMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']])
          .deleteAllKeys(ImmutableSet.of([1, 2]));
      assert(map).to.haveElements([
        match.anyTupleThat<[number, string]>().haveExactElements([0, 'a']),
      ]);
    });
  });

  test('deleteAt', () => {
    should('delete the item correctly', () => {
      const map = OrderedMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']])
          .deleteAt(1);
      assert(map).to.haveElements([
        match.anyTupleThat<[number, string]>().haveExactElements([0, 'a']),
        match.anyTupleThat<[number, string]>().haveExactElements([2, 'c']),
      ]);
    });
  });

  test('deleteKey', () => {
    should('delete the item correctly', () => {
      const map = OrderedMap.of([[0, 'a'], [1, 'b'], [2, 'c']]).deleteKey(1);
      assert(map).to.haveElements([
        match.anyTupleThat<[number, string]>().haveExactElements([0, 'a']),
        match.anyTupleThat<[number, string]>().haveExactElements([2, 'c']),
      ]);
    });

    should('do nothing if the item cannot be found', () => {
      const map = OrderedMap.of([[0, 'a'], [1, 'b'], [2, 'c']]).deleteKey(4);
      assert(map).to.haveElements([
        match.anyTupleThat<[number, string]>().haveExactElements([0, 'a']),
        match.anyTupleThat<[number, string]>().haveExactElements([1, 'b']),
        match.anyTupleThat<[number, string]>().haveExactElements([2, 'c']),
      ]);
    });
  });

  test('entries', () => {
    should('return the correct data', () => {
      const entries: Array<[number, string]> = [[0, 'a'], [1, 'b'], [2, 'c']];
      assert(OrderedMap.of(entries).entries()).to.haveElements([
        match.anyTupleThat<[number, string]>().haveExactElements([0, 'a']),
        match.anyTupleThat<[number, string]>().haveExactElements([1, 'b']),
        match.anyTupleThat<[number, string]>().haveExactElements([2, 'c']),
      ]);
    });
  });

  test('equals', () => {
    should('return true if the entries are the same', () => {
      assert(OrderedMap.of([[1, 'a'], [2, 'b']]).equals(OrderedMap.of([[1, 'a'], [2, 'b']])))
          .to.beTrue();
    });

    should('return false if one of the keys are different', () => {
      assert(OrderedMap.of([[1, 'a'], [3, 'b']]).equals(OrderedMap.of([[1, 'a'], [2, 'b']])))
          .to.beFalse();
    });

    should('return false if one of the values are different', () => {
      assert(OrderedMap.of([[1, 'a'], [2, 'c']]).equals(OrderedMap.of([[1, 'a'], [2, 'b']])))
          .to.beFalse();
    });

    should('return false if the ordering are different', () => {
      assert(OrderedMap.of([[2, 'b'], [1, 'a']]).equals(OrderedMap.of([[1, 'a'], [2, 'b']])))
          .to.beFalse();
    });

    should('return false if the sizes are different', () => {
      assert(OrderedMap.of([[1, 'a']]).equals(OrderedMap.of([[1, 'a'], [2, 'b']])))
          .to.beFalse();
    });
  });

  test('every', () => {
    should('return true if every entry passes the check', () => {
      const map = OrderedMap.of([[1, 'a'], [2, 'b'], [3, 'c']]);
      assert(map.every((_: string, key: number) => key > 0)).to.beTrue();
    });

    should('return false if one entry does not pass the check', () => {
      const map = OrderedMap.of([[1, 'a'], [2, 'b'], [3, 'c']]);
      assert(map.every((_: string, key: number) => key !== 2)).to.beFalse();
    });
  });

  test('everyItem', () => {
    should('return true if every entry passes the check', () => {
      const map = OrderedMap.of([[1, 'a'], [2, 'b'], [3, 'c']]);
      assert(map.everyItem(([key, _]: [number, string]) => key > 0)).to.beTrue();
    });

    should('return false if one entry does not pass the check', () => {
      const map = OrderedMap.of([[1, 'a'], [2, 'b'], [3, 'c']]);
      assert(map.everyItem(([key, _]: [number, string]) => key !== 2)).to.beFalse();
    });
  });

  test('filter', () => {
    should('filter the items correctly', () => {
      const map = OrderedMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']])
          .filter((_: string, index: number) => (index % 2) === 0);
      assert(map).to.haveElements([
        match.anyTupleThat<[number, string]>().haveExactElements([0, 'a']),
        match.anyTupleThat<[number, string]>().haveExactElements([2, 'c']),
      ]);
    });
  });

  test('filterByType', () => {
    should('filter the items correctly', () => {
      const map = OrderedMap
          .of<string | number, string>([[0, 'a'], ['1', 'b'], [2, 'c']])
          .filterByType(TupleOfType([StringType, StringType]));
      assert(map).to.haveElements([
        match.anyTupleThat<[string, string]>().haveExactElements(['1', 'b']),
      ]);
    });
  });

  test('filterItem', () => {
    should('filter the items correctly', () => {
      const map = OrderedMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']])
          .filterItem(([index, _]: [number, string]) => (index % 2) === 0);
      assert(map).to.haveElements([
        match.anyTupleThat<[number, string]>().haveExactElements([0, 'a']),
        match.anyTupleThat<[number, string]>().haveExactElements([2, 'c']),
      ]);
    });
  });

  test('find', () => {
    should('return the first matching entry in the map', () => {
      const entry = OrderedMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']])
          .find(([key, _]: [number, string]) => {
            return key >= 1;
          });
      assert(entry).to.haveElements([1, 'b']);
    });

    should('return null if the entry is not in the map', () => {
      const entry = OrderedMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']])
          .find(() => false);
      assert(entry).to.beNull();
    });
  });

  test('findEntry', () => {
    should('return the first matching entry in the map', () => {
      const entry = OrderedMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']])
          .findEntry((_: string, key: number) => {
            return key >= 1;
          });
      assert(entry).to.haveElements([1, 'b']);
    });

    should('return null if the entry is not in the map', () => {
      const entry = OrderedMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']])
          .findEntry(() => false);
      assert(entry).to.beNull();
    });
  });

  test('findKey', () => {
    should('return the first matching entry in the map', () => {
      const entry = OrderedMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']])
          .findKey((_: string, key: number) => {
            return key >= 1;
          });
      assert(entry).to.equal(1);
    });

    should('return null if the entry is not in the map', () => {
      const entry = OrderedMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']])
          .findKey(() => false);
      assert(entry).to.beNull();
    });
  });

  test('findValue', () => {
    should('return the first matching entry in the map', () => {
      const entry = OrderedMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']])
          .findValue((_: string, key: number) => {
            return key >= 1;
          });
      assert(entry).to.equal('b');
    });

    should('return null if the entry is not in the map', () => {
      const entry = OrderedMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']])
          .findValue(() => false);
      assert(entry).to.beNull();
    });
  });

  test('get', () => {
    should('return the correct item', () => {
      const map = OrderedMap.of([[0, 'a'], [1, 'b'], [2, 'c']]);
      assert(map.get(0)).to.equal('a');
      assert(map.get(1)).to.equal('b');
      assert(map.get(2)).to.equal('c');
    });
  });

  test('getAt', () => {
    should('return the correct item', () => {
      const map = OrderedMap.of([[0, 'a'], [1, 'b'], [2, 'c']]);
      // tslint:disable:no-non-null-assertion
      assert(map.getAt(0)!).to.haveElements([0, 'a']);
      assert(map.getAt(1)!).to.haveElements([1, 'b']);
      assert(map.getAt(2)!).to.haveElements([2, 'c']);
      // tslint:enable:no-non-null-assertion
    });
  });

  test('has', () => {
    should('return true if the item is in the list', () => {
      const entry: [number, string] = [1, 'b'];
      const map = OrderedMap.of([[0, 'a'], entry, [2, 'c']]);
      assert(map.has(entry)).to.beTrue();
    });

    should('return false if the item is not in the list', () => {
      const map = OrderedMap.of([[0, 'a'], [1, 'b'], [2, 'c']]);
      assert(map.has([3, 'd'])).to.beFalse();
    });
  });

  test('hasKey', () => {
    should('return true if the item is in the list', () => {
      const map = OrderedMap.of([[0, 'a'], [1, 'b'], [2, 'c']]);
      assert(map.hasKey(1)).to.beTrue();
    });

    should('return false if the item is not in the list', () => {
      const map = OrderedMap.of([[0, 'a'], [1, 'b'], [2, 'c']]);
      assert(map.hasKey(4)).to.beFalse();
    });
  });

  test('insertAllAt', () => {
    should('insert the items correctly', () => {
      const map = OrderedMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']])
          .insertAllAt(1, ImmutableSet.of([[3, 'd'], [4, 'e']] as Array<[number, string]>));
      assert(map).to.haveElements([[0, 'a'], [3, 'd'], [4, 'e'], [1, 'b'], [2, 'c']]);
    });
  });

  test('insertAt', () => {
    should('insert the item correctly', () => {
      const map = OrderedMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']])
          .insertAt(1, [3, 'd']);
      assert(map).to.haveElements([[0, 'a'], [3, 'd'], [1, 'b'], [2, 'c']]);
    });
  });

  test('keys', () => {
    should('return the correct keys', () => {
      const entries: Array<[number, string]> = [[0, 'a'], [1, 'b'], [2, 'c']];
      assert(OrderedMap.of(entries).keys()).to.haveElements([0, 1, 2]);
    });
  });

  test('map', () => {
    should('map the items correctly', () => {
      const map = OrderedMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']])
          .map((value: string, key: number) => `${key}${value}`);
      assert(map).to.haveElements([[0, '0a'], [1, '1b'], [2, '2c']]);
    });
  });

  test('mapItem', () => {
    should('map the items correctly', () => {
      const map = OrderedMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']])
          .mapItem(([key, value]: [number, string]) => `${key}${value}`);
      assert(map).to.haveElements(['0a', '1b', '2c']);
    });
  });

  test('max', () => {
    should(`return the correct max item`, () => {
      const max = OrderedMap
          .of([[-1, 1], [0, 2], [1, 3], [2, 1]])
          .max(([key1, value1]: [number, number], [key2, value2]: [number, number]) => {
            return Orderings.normal()(key1 + value1, key2 + value2);
          });
      assert(max).to.haveElements([1, 3]);
    });

    should(`return null if the list is null`, () => {
      assert(OrderedMap.of<number, number>([]).max(Orderings.normal())).to.beNull();
    });
  });

  test('min', () => {
    should(`return the correct min item`, () => {
      const min = OrderedMap
          .of([[1, 3], [0, 2], [-1, 1], [2, 1]])
          .min(([key1, value1]: [number, number], [key2, value2]: [number, number]) => {
            return Orderings.normal()(key1 + value1, key2 + value2);
          });
      assert(min).to.haveElements([-1, 1]);
    });

    should(`return null if the list is null`, () => {
      assert(OrderedMap.of<number, number>([]).min(Orderings.normal())).to.beNull();
    });
  });

  test('reduce', () => {
    should('return the correct value', () => {
      const result = OrderedMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']] as Array<[number, string]>)
          .reduce((prev: string, index: string, key: number) => {
            return `${prev},${key}${index}`;
          },      '@');
      assert(result).to.equal(`@,0a,1b,2c`);
    });
  });

  test('reduceItem', () => {
    should('return the correct value', () => {
      const result = OrderedMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']] as Array<[number, string]>)
          .reduceItem((prev: string, [key, index]: [number, string]) => {
            return `${prev},${key}${index}`;
          },          '@');
      assert(result).to.equal(`@,0a,1b,2c`);
    });
  });

  test('reverse', () => {
    should('return the correct value', () => {
      const entries: Array<[number, string]> = [[0, 'a'], [1, 'b'], [2, 'c']];
      assert(OrderedMap.of(entries).reverse()).to.haveElements([[2, 'c'], [1, 'b'], [0, 'a']]);
    });
  });

  test('set', () => {
    should('set the item correctly', () => {
      const map = OrderedMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']])
          .set(1, 'blah');
      assert(map).to.haveElements([[0, 'a'], [1, 'blah'], [2, 'c']]);
    });
  });

  test('setAt', () => {
    should('set the item correctly', () => {
      const map = OrderedMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']])
          .setAt(1, [3, 'd']);
      assert(map).to.haveElements([[0, 'a'], [3, 'd'], [2, 'c']]);
    });
  });

  test('size', () => {
    should('return the correct length', () => {
      assert(OrderedMap.of([[0, 'a'], [1, 'b'], [2, 'c']]).size()).to.equal(3);
    });
  });

  test('some', () => {
    should('return true if some element passes the check', () => {
      const map = OrderedMap.of([[1, 'a'], [2, 'b'], [3, 'c']]);
      assert(map.some((_: string, key: number) => key === 2)).to.beTrue();
    });

    should('return false if every element does not pass the check', () => {
      const map = OrderedMap.of([[1, 'a'], [2, 'b'], [3, 'c']]);
      assert(map.some((_: string, key: number) => key < 0)).to.beFalse();
    });
  });

  test('someItem', () => {
    should('return true if some element passes the check', () => {
      const map = OrderedMap.of([[1, 'a'], [2, 'b'], [3, 'c']]);
      assert(map.someItem(([key, _]: [number, string]) => key === 2)).to.beTrue();
    });

    should('return false if every element does not pass the check', () => {
      const map = OrderedMap.of([[1, 'a'], [2, 'b'], [3, 'c']]);
      assert(map.someItem(([key, _]: [number, string]) => key < 0)).to.beFalse();
    });
  });

  test('sort', () => {
    should('sort the items correctly', () => {
      const map = OrderedMap
          .of([[0, 'a'], [1, 'b'], [2, 'c']])
          .sort(([key1]: [number, string], [key2]: [number, string]) => {
            if (key1 > key2) {
              return -1;
            } else if (key2 > key1) {
              return 1;
            } else {
              return 0;
            }
          });
      assert(map).to.haveElements([[2, 'c'], [1, 'b'], [0, 'a']]);
    });
  });

  test('values', () => {
    should('return the correct data', () => {
      const entries: Array<[number, string]> = [[0, 'a'], [1, 'b'], [2, 'c']];
      assert(OrderedMap.of(entries).values()).to.haveElements(['a', 'b', 'c']);
    });
  });

  test('of', () => {
    should('create the map correctly from entries array', () => {
      const entries: Array<[number, string]> = [[0, 'a'], [1, 'b'], [2, 'c']];
      assert(OrderedMap.of(entries)).to.haveElements(entries);
    });

    should('dedupe entries', () => {
      const entries: Array<[number, string]> = [[0, 'a'], [1, 'b'], [2, 'c'], [2, 'd']];
      assert(OrderedMap.of(entries)).to.haveElements([[0, 'a'], [1, 'b'], [2, 'c']]);
    });
  });
});

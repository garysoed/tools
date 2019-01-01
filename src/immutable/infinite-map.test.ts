import { assert, match, should, test } from 'gs-testing/export/main';
import { NumberType, TupleOfType } from 'gs-types/export';
import { ImmutableSet } from './immutable-set';
import { InfiniteMap } from './infinite-map';
import { Iterables } from './iterables';


test('immutable.InfiniteMap', () => {
  function* generateInts(): IterableIterator<number> {
    let i = 0;
    while (true) {
      yield i++;
    }
  }

  test('[Symbol.iterator]', () => {
    should('return the correct entries', () => {
      const map = InfiniteMap.of(Iterables.of(generateInts), (i: number) => `${i}`);
      assert(map).to.startWith([
        match.anyTupleThat<[number, string]>().haveExactElements([0, '0']),
        match.anyTupleThat<[number, string]>().haveExactElements([1, '1']),
        match.anyTupleThat<[number, string]>().haveExactElements([2, '2']),
        match.anyTupleThat<[number, string]>().haveExactElements([3, '3']),
      ]);
    });
  });

  test('deleteAllKey', () => {
    should('delete the keys correctly', () => {
      const map = InfiniteMap
          .of(Iterables.of(generateInts), (i: number) => `${i}`)
          .deleteAllKeys(ImmutableSet.of([1, 2, 3]));
      assert(map).to.startWith([
        match.anyTupleThat<[number, string]>().haveExactElements([0, '0']),
        match.anyTupleThat<[number, string]>().haveExactElements([4, '4']),
        match.anyTupleThat<[number, string]>().haveExactElements([5, '5']),
        match.anyTupleThat<[number, string]>().haveExactElements([6, '6']),
      ]);
    });
  });

  test('deleteKey', () => {
    should('delete the key correctly', () => {
      const map = InfiniteMap
          .of(Iterables.of(generateInts), (i: number) => `${i}`)
          .deleteKey(1);
      assert(map).to.startWith([
        match.anyTupleThat<[number, string]>().haveExactElements([0, '0']),
        match.anyTupleThat<[number, string]>().haveExactElements([2, '2']),
        match.anyTupleThat<[number, string]>().haveExactElements([3, '3']),
        match.anyTupleThat<[number, string]>().haveExactElements([4, '4']),
      ]);
    });
  });

  test('entries', () => {
    should('return the correct entries', () => {
      const map = InfiniteMap.of(Iterables.of(generateInts), (i: number) => `${i}`);
      assert(map).to.startWith([
        match.anyTupleThat<[number, string]>().haveExactElements([0, '0']),
        match.anyTupleThat<[number, string]>().haveExactElements([1, '1']),
        match.anyTupleThat<[number, string]>().haveExactElements([2, '2']),
        match.anyTupleThat<[number, string]>().haveExactElements([3, '3']),
      ]);
    });
  });

  test('filter', () => {
    should('filter correctly', () => {
      const map = InfiniteMap.of(Iterables.of(generateInts), (i: number) => `${i}`)
          .filter((_: string, key: number) => {
            return (key % 2) === 0;
          });
      assert(map).to.startWith([
        match.anyTupleThat<[number, string]>().haveExactElements([0, '0']),
        match.anyTupleThat<[number, string]>().haveExactElements([2, '2']),
        match.anyTupleThat<[number, string]>().haveExactElements([4, '4']),
        match.anyTupleThat<[number, string]>().haveExactElements([6, '6']),
      ]);
    });
  });

  test('filterByType', () => {
    should('filter correctly', () => {
      const map = InfiniteMap
          .of(Iterables.of(generateInts), (i: number) => (i % 2) === 0 ? i : 'a')
          .filterByType(TupleOfType([NumberType, NumberType]));
      assert(map).to.startWith([
        match.anyTupleThat<[number, number]>().haveExactElements([0, 0]),
        match.anyTupleThat<[number, number]>().haveExactElements([2, 2]),
        match.anyTupleThat<[number, number]>().haveExactElements([4, 4]),
        match.anyTupleThat<[number, number]>().haveExactElements([6, 6]),
      ]);
    });
  });

  test('filterItem', () => {
    should('filter correctly', () => {
      const map = InfiniteMap.of(Iterables.of(generateInts), (i: number) => `${i}`)
          .filterItem(([key, _]: [number, string]) => {
            return (key % 2) === 0;
          });
      assert(map).to.startWith([
        match.anyTupleThat<[number, string]>().haveExactElements([0, '0']),
        match.anyTupleThat<[number, string]>().haveExactElements([2, '2']),
        match.anyTupleThat<[number, string]>().haveExactElements([4, '4']),
        match.anyTupleThat<[number, string]>().haveExactElements([6, '6']),
      ]);
    });
  });

  test('get', () => {
    should('return the correct value', () => {
      const map = InfiniteMap.of(
          Iterables.of(generateInts),
          (i: number) => `${i}`);
      assert(map.get(0)).to.equal('0');
      assert(map.get(1)).to.equal('1');
      assert(map.get(2)).to.equal('2');
      assert(map.get(3)).to.equal('3');
    });
  });

  test('keys', () => {
    should('return the correct keys', () => {
      const map = InfiniteMap.of(
          Iterables.of(generateInts),
          (i: number) => `${i}`);
      assert(map.keys()).to.startWith([0, 1, 2, 3]);
    });
  });

  test('map', () => {
    should('map correctly', () => {
      const map = InfiniteMap.of(Iterables.of(generateInts), (i: number) => `${i}`)
          .map((_: string, key: number) => {
            return (key % 2) === 0;
          });
      assert(map).to.startWith([
        match.anyTupleThat<[number, boolean]>().haveExactElements([0, true]),
        match.anyTupleThat<[number, boolean]>().haveExactElements([1, false]),
        match.anyTupleThat<[number, boolean]>().haveExactElements([2, true]),
        match.anyTupleThat<[number, boolean]>().haveExactElements([3, false]),
      ]);
    });
  });

  test('mapItem', () => {
    should('map correctly', () => {
      const list = InfiniteMap.of(Iterables.of(generateInts), (i: number) => `${i}`)
          .mapItem(([key, _]: [number, string]) => {
            return (key % 2) === 0;
          });
      assert(list).to.startWith([true, false, true, false]);
    });
  });

  test('set', () => {
    should('set the value correctly', () => {
      const value = 'value';
      const map = InfiniteMap.of(Iterables.of(generateInts), (i: number) => `${i}`)
          .set(2, value);
      assert(map).to.startWith([
        match.anyTupleThat<[number, string]>().haveExactElements([0, '0']),
        match.anyTupleThat<[number, string]>().haveExactElements([1, '1']),
        match.anyTupleThat<[number, string]>().haveExactElements([2, value]),
        match.anyTupleThat<[number, string]>().haveExactElements([3, '3']),
      ]);
    });
  });

  test('values', () => {
    should('return the correct values', () => {
      const map = InfiniteMap.of(Iterables.of(generateInts), (i: number) => `${i}`);
      assert(map.values()).to.startWith(['0', '1', '2', '3']);
    });
  });
});

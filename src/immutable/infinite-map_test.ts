import { assert, TestBase } from 'gs-testing/export/main';
TestBase.setup();

import { NumberType, TupleOfType } from '../check';
import { ImmutableSet } from '../immutable/immutable-set';
import { InfiniteMap } from '../immutable/infinite-map';
import { Iterables } from '../immutable/iterables';


describe('immutable.InfiniteMap', () => {
  function* generateInts(): IterableIterator<number> {
    let i = 0;
    while (true) {
      yield i++;
    }
  }

  describe('[Symbol.iterator]', () => {
    should('return the correct entries', () => {
      const map = InfiniteMap.of(Iterables.of(generateInts), (i: number) => `${i}`);
      assert(map).to.startWith([[0, '0'], [1, '1'], [2, '2'], [3, '3']]);
    });
  });

  describe('deleteAllKey', () => {
    should('delete the keys correctly', () => {
      const map = InfiniteMap
          .of(Iterables.of(generateInts), (i: number) => `${i}`)
          .deleteAllKeys(ImmutableSet.of([1, 2, 3]));
      assert(map).to.startWith([[0, '0'], [4, '4'], [5, '5'], [6, '6']]);
    });
  });

  describe('deleteKey', () => {
    should('delete the key correctly', () => {
      const map = InfiniteMap
          .of(Iterables.of(generateInts), (i: number) => `${i}`)
          .deleteKey(1);
      assert(map).to.startWith([[0, '0'], [2, '2'], [3, '3'], [4, '4']]);
    });
  });

  describe('entries', () => {
    should('return the correct entries', () => {
      const map = InfiniteMap.of(Iterables.of(generateInts), (i: number) => `${i}`);
      assert(map.entries()).to.startWith([[0, '0'], [1, '1'], [2, '2'], [3, '3']]);
    });
  });

  describe('filter', () => {
    should('filter correctly', () => {
      const map = InfiniteMap.of(Iterables.of(generateInts), (i: number) => `${i}`)
          .filter((_: string, key: number) => {
            return (key % 2) === 0;
          });
      assert(map).to.startWith([[0, '0'], [2, '2'], [4, '4'], [6, '6']]);
    });
  });

  describe('filterByType', () => {
    should('filter correctly', () => {
      const map = InfiniteMap
          .of(Iterables.of(generateInts), (i: number) => (i % 2) === 0 ? i : 'a')
          .filterByType(TupleOfType([NumberType, NumberType]));
      assert(map).to.startWith([[0, 0], [2, 2], [4, 4], [6, 6]]);
    });
  });

  describe('filterItem', () => {
    should('filter correctly', () => {
      const map = InfiniteMap.of(Iterables.of(generateInts), (i: number) => `${i}`)
          .filterItem(([key, _]: [number, string]) => {
            return (key % 2) === 0;
          });
      assert(map).to.startWith([[0, '0'], [2, '2'], [4, '4'], [6, '6']]);
    });
  });

  describe('get', () => {
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

  describe('keys', () => {
    should('return the correct keys', () => {
      const map = InfiniteMap.of(
          Iterables.of(generateInts),
          (i: number) => `${i}`);
      assert(map.keys()).to.startWith([0, 1, 2, 3]);
    });
  });

  describe('map', () => {
    should('map correctly', () => {
      const map = InfiniteMap.of(Iterables.of(generateInts), (i: number) => `${i}`)
          .map((_: string, key: number) => {
            return (key % 2) === 0;
          });
      assert(map).to.startWith([[0, true], [1, false], [2, true], [3, false]]);
    });
  });

  describe('mapItem', () => {
    should('map correctly', () => {
      const map = InfiniteMap.of(Iterables.of(generateInts), (i: number) => `${i}`)
          .mapItem(([key, _]: [number, string]) => {
            return (key % 2) === 0;
          });
      assert(map).to.startWith([true, false, true, false]);
    });
  });

  describe('set', () => {
    should('set the value correctly', () => {
      const value = 'value';
      const map = InfiniteMap.of(Iterables.of(generateInts), (i: number) => `${i}`)
          .set(2, value);
      assert(map).to.startWith([[0, '0'], [1, '1'], [2, value], [3, '3']]);
    });
  });

  describe('values', () => {
    should('return the correct values', () => {
      const map = InfiniteMap.of(Iterables.of(generateInts), (i: number) => `${i}`);
      assert(map.values()).to.startWith(['0', '1', '2', '3']);
    });
  });
});

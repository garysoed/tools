import { assert, match, should, test } from 'gs-testing/export/main';
import { NumberType } from 'gs-types/export';
import { ImmutableSet } from './immutable-set';
import { InfiniteList } from './infinite-list';


test('immutable.InfiniteList', () => {
  test('[Symbol.iterator]', () => {
    should('return the correct elements', () => {
      const list = InfiniteList.of<string>((i: number) => `${i}`);
      assert(list).to.startWith(['0', '1', '2', '3']);
    });

    should('skip undefined elements', () => {
      const list = InfiniteList.of<string>((i: number) => (i % 2) === 0 ? `${i}` : undefined);
      assert(list).to.startWith(['0', '2', '4', '6']);
    });
  });

  test('deleteAllKeys', () => {
    should('delete all the keys specified', () => {
      const list = InfiniteList.of<string>((i: number) => `${i}`)
          .deleteAllKeys(ImmutableSet.of([1, 3]));
      assert(list).to.startWith(['0', '2', '4', '5', '6']);
    });
  });

  test('deleteKey', () => {
    should('delete the specified key', () => {
      const list = InfiniteList.of<string>((i: number) => `${i}`).deleteKey(1);
      assert(list).to.startWith(['0', '2', '3', '4']);
    });
  });

  test('entries', () => {
    should('return the correct entries', () => {
      const list = InfiniteList.of<string>((i: number) => `${i}`);
      assert(list.entries()).to.startWith([
        match.anyTupleThat<[number, string]>().haveExactElements([0, '0']),
        match.anyTupleThat<[number, string]>().haveExactElements([1, '1']),
        match.anyTupleThat<[number, string]>().haveExactElements([2, '2']),
        match.anyTupleThat<[number, string]>().haveExactElements([3, '3']),
      ]);
    });

    should('skip undefined elements', () => {
      const list = InfiniteList.of<string>((i: number) => (i % 2) === 0 ? `${i}` : undefined);
      assert(list.entries()).to.startWith([
        match.anyTupleThat<[number, string]>().haveExactElements([0, '0']),
        match.anyTupleThat<[number, string]>().haveExactElements([2, '2']),
        match.anyTupleThat<[number, string]>().haveExactElements([4, '4']),
        match.anyTupleThat<[number, string]>().haveExactElements([6, '6']),
      ]);
    });
  });

  test('filter', () => {
    should('filter elements correctly', () => {
      const list = InfiniteList.of<string>((i: number) => `${i}`)
          .filter((_: string, index: number) => {
            return (index % 2) === 0;
          });
      assert(list).to.startWith(['0', '2', '4', '6']);
    });
  });

  test('filterByType', () => {
    should('filter elements correctly', () => {
      const list = InfiniteList
          .of<string | number>((i: number) => (i % 2) === 0 ? i : 'a')
          .filterByType(NumberType);
      assert(list).to.startWith([0, 2, 4, 6]);
    });
  });

  test('filterItem', () => {
    should('filter elements correctly', () => {
      const list = InfiniteList.of<string>((i: number) => `${i}`)
          .filterItem((item: string) => {
            return item !== '2';
          });
      assert(list).to.startWith(['0', '1', '3', '4']);
    });
  });

  test('get', () => {
    should('return elements correctly', () => {
      const list = InfiniteList.of<string>((i: number) => `${i}`);
      assert(list.get(0)).to.equal('0');
      assert(list.get(1)).to.equal('1');
      assert(list.get(2)).to.equal('2');
      assert(list.get(3)).to.equal('3');
    });
  });

  test('keys', () => {
    should('return the keys correctly', () => {
      const list = InfiniteList.of<string>((i: number) => `${i}`);
      assert(list.keys()).to.startWith([0, 1, 2, 3]);
    });

    should('skip entries with undefined value', () => {
      const list = InfiniteList.of<string>((i: number) => (i % 2) === 0 ? `${i}` : undefined);
      assert(list.keys()).to.startWith([0, 2, 4, 6]);
    });
  });

  test('map', () => {
    should('map the values correctly', () => {
      const list = InfiniteList.of<string>((i: number) => `${i}`)
          .map((item: string, index: number) => {
            return `${item}@${index + 1}`;
          });
      assert(list).to.startWith(['0@1', '1@2', '2@3', '3@4']);
    });
  });

  test('mapItem', () => {
    should('map the values correctly', () => {
      const list = InfiniteList.of<string>((i: number) => `${i}`)
          .map((item: string) => {
            return `${item}mapped`;
          });
      assert(list).to.startWith(['0mapped', '1mapped', '2mapped', '3mapped']);
    });
  });

  test('set', () => {
    should('set the element correctly', () => {
      const value = 'value';
      const list = InfiniteList.of<string>((i: number) => `${i}`).set(2, value);
      assert(list).to.startWith(['0', '1', value, '3']);
    });
  });

  test('values', () => {
    should('return the values correctly', () => {
      const list = InfiniteList.of<string>((i: number) => `${i}`);
      assert(list.values()).to.startWith(['0', '1', '2', '3']);
    });

    should('skip entries with undefined value', () => {
      const list = InfiniteList.of<string>((i: number) => (i % 2) === 0 ? `${i}` : undefined);
      assert(list.values()).to.startWith(['0', '2', '4', '6']);
    });
  });
});

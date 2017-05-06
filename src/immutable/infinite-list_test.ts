import { assert, TestBase } from '../test-base';
TestBase.setup();

import { InfiniteList } from '../immutable/infinite-list';


describe('immutable.InfiniteList', () => {
  describe('[Symbol.iterator]', () => {
    it('should return the correct elements', () => {
      const list = new InfiniteList<string>((i: number) => `${i}`);
      assert(list).to.startWith(['0', '1', '2', '3']);
    });

    it('should skip undefined elements', () => {
      const list = new InfiniteList<string>((i: number) => (i % 2) === 0 ? `${i}` : undefined);
      assert(list).to.startWith(['0', '2', '4', '6']);
    });
  });

  describe('entries', () => {
    it('should return the correct entries', () => {
      const list = new InfiniteList<string>((i: number) => `${i}`);
      assert(list.entries()).to.startWith([[0, '0'], [1, '1'], [2, '2'], [3, '3']]);
    });

    it('should skip undefined elements', () => {
      const list = new InfiniteList<string>((i: number) => (i % 2) === 0 ? `${i}` : undefined);
      assert(list.entries()).to.startWith([[0, '0'], [2, '2'], [4, '4'], [6, '6']]);
    });
  });

  describe('filter', () => {
    it('should filter elements correctly', () => {
      const list = new InfiniteList<string>((i: number) => `${i}`)
          .filter((item: string, index: number) => {
            return (index % 2) === 0;
          });
      assert(list).to.startWith(['0', '2', '4', '6']);
    });
  });

  describe('filterItem', () => {
    it('should filter elements correctly', () => {
      const list = new InfiniteList<string>((i: number) => `${i}`)
          .filterItem((item: string) => {
            return item !== '2';
          });
      assert(list).to.startWith(['0', '1', '3', '4']);
    });
  });

  describe('get', () => {
    it('should return elements correctly', () => {
      const list = new InfiniteList<string>((i: number) => `${i}`);
      assert(list.get(0)).to.equal('0');
      assert(list.get(1)).to.equal('1');
      assert(list.get(2)).to.equal('2');
      assert(list.get(3)).to.equal('3');
    });
  });

  describe('keys', () => {
    it('should return the keys correctly', () => {
      const list = new InfiniteList<string>((i: number) => `${i}`);
      assert(list.keys()).to.startWith([0, 1, 2, 3]);
    });

    it('should skip entries with undefined value', () => {
      const list = new InfiniteList<string>((i: number) => (i % 2) === 0 ? `${i}` : undefined);
      assert(list.keys()).to.startWith([0, 2, 4, 6]);
    });
  });

  describe('map', () => {
    it('should map the values correctly', () => {
      const list = new InfiniteList<string>((i: number) => `${i}`)
          .map((item: string, index: number) => {
            return `${item}@${index + 1}`;
          });
      assert(list).to.startWith(['0@1', '1@2', '2@3', '3@4']);
    });
  });

  describe('mapItem', () => {
    it('should map the values correctly', () => {
      const list = new InfiniteList<string>((i: number) => `${i}`)
          .map((item: string) => {
            return `${item}mapped`;
          });
      assert(list).to.startWith(['0mapped', '1mapped', '2mapped', '3mapped']);
    });
  });

  describe('set', () => {
    it('should set the element correctly', () => {
      const value = 'value';
      const list = new InfiniteList<string>((i: number) => `${i}`).set(2, value);
      assert(list).to.startWith(['0', '1', value, '3']);
    });
  });

  describe('values', () => {
    it('should return the values correctly', () => {
      const list = new InfiniteList<string>((i: number) => `${i}`);
      assert(list.values()).to.startWith(['0', '1', '2', '3']);
    });

    it('should skip entries with undefined value', () => {
      const list = new InfiniteList<string>((i: number) => (i % 2) === 0 ? `${i}` : undefined);
      assert(list.values()).to.startWith(['0', '2', '4', '6']);
    });
  });
});

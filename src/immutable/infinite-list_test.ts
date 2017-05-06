import { assert, TestBase } from '../test-base';
TestBase.setup();

import { InfiniteList } from '../immutable/infinite-list';


describe('immutable.InfiniteList', () => {
  describe('[Symbol.iterator]', () => {
    it('should return the correct elements', () => {
      const list = new InfiniteList<string>((i: number) => `${i}`);
      const iterator = list[Symbol.iterator]();
      assert(iterator.next().value).to.equal('0');
      assert(iterator.next().value).to.equal('1');
      assert(iterator.next().value).to.equal('2');
      assert(iterator.next().value).to.equal('3');
    });

    it('should skip undefined elements', () => {
      const list = new InfiniteList<string>((i: number) => (i % 2) === 0 ? `${i}` : undefined);
      const iterator = list[Symbol.iterator]();
      assert(iterator.next().value).to.equal('0');
      assert(iterator.next().value).to.equal('2');
      assert(iterator.next().value).to.equal('4');
      assert(iterator.next().value).to.equal('6');
    });
  });

  describe('entries', () => {
    it('should return the correct entries', () => {
      const list = new InfiniteList<string>((i: number) => `${i}`);
      const iterator = list.entries()[Symbol.iterator]();
      assert(iterator.next().value).to.equal([0, '0']);
      assert(iterator.next().value).to.equal([1, '1']);
      assert(iterator.next().value).to.equal([2, '2']);
      assert(iterator.next().value).to.equal([3, '3']);
    });

    it('should skip undefined elements', () => {
      const list = new InfiniteList<string>((i: number) => (i % 2) === 0 ? `${i}` : undefined);
      const iterator = list.entries()[Symbol.iterator]();
      assert(iterator.next().value).to.equal([0, '0']);
      assert(iterator.next().value).to.equal([2, '2']);
      assert(iterator.next().value).to.equal([4, '4']);
      assert(iterator.next().value).to.equal([6, '6']);
    });
  });

  describe('filter', () => {
    it('should filter elements correctly', () => {
      const list = new InfiniteList<string>((i: number) => `${i}`)
          .filter((item: string, index: number) => {
            return (index % 2) === 0;
          });
      const iterator = list[Symbol.iterator]();
      assert(iterator.next().value).to.equal('0');
      assert(iterator.next().value).to.equal('2');
      assert(iterator.next().value).to.equal('4');
      assert(iterator.next().value).to.equal('6');
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
      const iterator = list.keys()[Symbol.iterator]();
      assert(iterator.next().value).to.equal(0);
      assert(iterator.next().value).to.equal(1);
      assert(iterator.next().value).to.equal(2);
      assert(iterator.next().value).to.equal(3);
    });

    it('should skip entries with undefined value', () => {
      const list = new InfiniteList<string>((i: number) => (i % 2) === 0 ? `${i}` : undefined);
      const iterator = list.keys()[Symbol.iterator]();
      assert(iterator.next().value).to.equal(0);
      assert(iterator.next().value).to.equal(2);
      assert(iterator.next().value).to.equal(4);
      assert(iterator.next().value).to.equal(6);
    });
  });

  describe('map', () => {
    it('should map the values correctly', () => {
      const list = new InfiniteList<string>((i: number) => `${i}`)
          .map((item: string, index: number) => {
            return `${item}@${index + 1}`;
          });
      const iterator = list[Symbol.iterator]();
      assert(iterator.next().value).to.equal('0@1');
      assert(iterator.next().value).to.equal('1@2');
      assert(iterator.next().value).to.equal('2@3');
      assert(iterator.next().value).to.equal('3@4');
    });
  });

  describe('set', () => {
    it('should set the element correctly', () => {
      const list = new InfiniteList<string>((i: number) => `${i}`)
          .set(2, 'blah');
      assert(list.get(0)).to.equal('0');
      assert(list.get(1)).to.equal('1');
      assert(list.get(2)).to.equal('blah');
      assert(list.get(3)).to.equal('3');
    });
  });

  describe('values', () => {
    it('should return the values correctly', () => {
      const list = new InfiniteList<string>((i: number) => `${i}`);
      const iterator = list.values()[Symbol.iterator]();
      assert(iterator.next().value).to.equal('0');
      assert(iterator.next().value).to.equal('1');
      assert(iterator.next().value).to.equal('2');
      assert(iterator.next().value).to.equal('3');
    });

    it('should skip entries with undefined value', () => {
      const list = new InfiniteList<string>((i: number) => (i % 2) === 0 ? `${i}` : undefined);
      const iterator = list.values()[Symbol.iterator]();
      assert(iterator.next().value).to.equal('0');
      assert(iterator.next().value).to.equal('2');
      assert(iterator.next().value).to.equal('4');
      assert(iterator.next().value).to.equal('6');
    });
  });
});

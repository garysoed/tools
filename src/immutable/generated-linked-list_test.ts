import { assert, TestBase } from '../test-base';
TestBase.setup();

import { GeneratedLinkedList } from '../immutable/generated-linked-list';


describe('immutable.GeneratedLinkedList', () => {
  function* generateInts(): IterableIterator<number> {
    let i = 0;
    while (true) {
      yield i;
      i++;
    }
  }

  describe('filter', () => {
    it('should exclude items that are excluded by the filter', () => {
      const list = new GeneratedLinkedList(generateInts)
          .filter((n: number) => {
            return (n % 2) === 0;
          });
      const iterator = list[Symbol.iterator]();
      assert(iterator.next().value).to.equal(0);
      assert(iterator.next().value).to.equal(2);
      assert(iterator.next().value).to.equal(4);
      assert(iterator.next().value).to.equal(6);
    });
  });

  describe('map', () => {
    it('should map correctly', () => {
      const list = new GeneratedLinkedList(generateInts)
          .map((n: number) => {
            return `${n}`;
          });
      const iterator = list[Symbol.iterator]();
      assert(iterator.next().value).to.equal('0');
      assert(iterator.next().value).to.equal('1');
      assert(iterator.next().value).to.equal('2');
      assert(iterator.next().value).to.equal('3');
    });
  });
});

import { assert, should } from 'gs-testing/export/main';
import { NumberType } from 'gs-types/export';
import { GeneratedLinkedList } from '../immutable/generated-linked-list';
import { Iterables } from '../immutable/iterables';


describe('immutable.GeneratedLinkedList', () => {
  function* generateInts(): IterableIterator<number> {
    let i = 0;
    while (true) {
      yield i;
      i++;
    }
  }

  describe('filterByType', () => {
    should(`filter the items correctly`, () => {
      function* generateItems(): IterableIterator<number | string> {
        let i = 0;
        while (true) {
          i++;
          if ((i % 2) === 0) {
            yield 'a';
          } else {
            yield i;
          }
        }
      }

      const list = new GeneratedLinkedList(Iterables.of(generateItems))
          .filterByType(NumberType);
      assert(list).to.startWith([1, 3, 5, 7]);
    });
  });

  describe('filterItem', () => {
    should('exclude items that are excluded by the filter', () => {
      const list = new GeneratedLinkedList(Iterables.of(generateInts))
          .filterItem((n: number) => {
            return (n % 2) === 0;
          });
      assert(list).to.startWith([0, 2, 4, 6]);
    });
  });

  describe('mapItem', () => {
    should('map correctly', () => {
      const list = new GeneratedLinkedList(Iterables.of(generateInts))
          .mapItem((n: number) => {
            return `${n}`;
          });
      assert(list).to.startWith(['0', '1', '2', '3']);
    });
  });
});

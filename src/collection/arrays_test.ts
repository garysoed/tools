import { assert, TestBase } from '../test-base';
TestBase.setup();

import { Arrays } from '../collection/arrays';
import { Iterables } from '../immutable/iterables';
import { Fakes } from '../mock/fakes';
import { Mocks } from '../mock/mocks';


describe('collection.Arrays', () => {
  describe('flatten', () => {
    it('should flatten the array correctly', () => {
      const items = [
        [1, 2, 3],
        [4, 5],
        [6, 7, 8, 9],
      ];
      assert(Arrays.flatten(items).asArray()).to.equal([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
  });

  describe('fromItemList', () => {
    it('should return the correct FluentIndexable', () => {
      const element1 = Mocks.object('element1');
      const element2 = Mocks.object('element2');
      const element3 = Mocks.object('element3');
      const elements = [element1, element2, element3];
      const mockCollection = jasmine.createSpyObj('Collection', ['item']);
      mockCollection.length = 3;
      Fakes.build(mockCollection.item).call((i: number) => {
        return elements[i];
      });

      assert(Arrays.fromItemList(mockCollection).asArray()).to.equal(elements);
    });
  });

  describe('fromIterable', () => {
    it('should return the correct FluentIndexable', () => {
      const data = [1, 1, 2, 2, 3];
      assert(Arrays.fromIterable(data).asArray()).to.equal(data);
    });
  });

  describe('fromIterator', () => {
    it('should return the correct FluentIndexable', () => {
      const data = [1, 1, 2, 2, 3];
      assert(Arrays.fromIterator(data[Symbol.iterator]()).asArray()).to.equal(data);
    });
  });

  describe('fromNumericIndexable', () => {
    it('should return the correct FluentIndexable', () => {
      const element1 = Mocks.object('element1');
      const element2 = Mocks.object('element2');
      const element3 = Mocks.object('element3');
      const elements = [element1, element2, element3];

      assert(Arrays.fromNumericIndexable(elements).asArray()).to.equal(elements);
    });
  });

  describe('of', () => {
    it('should return the correct FluentIndexable', () => {
      const data = [1, 2, 3];
      assert(Arrays.of(data).asArray()).to.equal(data);
    });
  });
});

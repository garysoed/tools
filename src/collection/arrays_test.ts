import {assert, TestBase} from '../test-base';
TestBase.setup();

import {ArrayIterable} from './array-iterable';
import {Arrays} from './arrays';
import {Mocks} from '../mock/mocks';


describe('collection.Arrays', () => {
  describe('fromIterable', () => {
    it('should return the correct FluentIndexable', () => {
      let data = [1, 1, 2, 2, 3];
      assert(Arrays.fromIterable(ArrayIterable.newInstance(data)).asArray()).to.equal(data);
    });
  });

  describe('fromIterator', () => {
    it('should return the correct FluentIndexable', () => {
      let data = [1, 1, 2, 2, 3];
      let iterator = ArrayIterable.newInstance(data)[Symbol.iterator]();
      assert(Arrays.fromIterator(iterator).asArray()).to.equal(data);
    });
  });

  describe('fromNodeList', () => {
    it('should return the correct FluentIndexable', () => {
      let mockNode1 = Mocks.object('Node1');
      let mockNode2 = Mocks.object('Node2');
      let data: Node[] = [mockNode1, mockNode2];
      let mockNodeList = jasmine.createSpyObj('NodeList', ['item']);
      mockNodeList.item.and.callFake((index: number) => {
        return data[index];
      });
      mockNodeList.length = data.length;

      assert(Arrays.fromNodeList(mockNodeList).asArray()).to.equal(data);
    });
  });

  describe('of', () => {
    it('should return the correct FluentIndexable', () => {
      let data = [1, 2, 3];
      assert(Arrays.of(data).asArray()).to.equal(data);
    });
  });
});

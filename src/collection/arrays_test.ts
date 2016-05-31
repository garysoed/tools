import TestBase from '../test-base';
TestBase.setup();

import {ArrayIterable} from './array-iterable';
import {Arrays} from './arrays';
import {Indexables} from './indexables';
import {Mocks} from '../mock/mocks';


describe('collection.Arrays', () => {
  describe('fromIterable', () => {
    it('should return the correct FluentIndexable', () => {
      let data = [1, 1, 2, 2, 3];
      expect(Arrays.fromIterable(ArrayIterable.newInstance(data)).asArray()).toEqual(data);
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

      expect(Arrays.fromNodeList(mockNodeList).asArray()).toEqual(data);
    });
  });

  describe('of', () => {
    it('should return the correct FluentIndexable', () => {
      let data = [1, 2, 3];
      expect(Arrays.of(data).asArray()).toEqual(data);
    });
  });
});

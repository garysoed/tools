import { assert, Mocks, TestBase } from '../test-base';
TestBase.setup();

import { GNode } from '../graph/g-node';
import { ImmutableList } from '../immutable';

class TestNode extends GNode<number> {
  constructor(private readonly mockFn_: (...args: any[]) => number) {
    super(ImmutableList.of([]));
  }

  execute_(_: {} | null, params: Iterable<any>): number {
    return this.mockFn_(params);
  }
}

describe('graph.GNode', () => {
  let mockFn: any;
  let node: TestNode;

  beforeEach(() => {
    mockFn = jasmine.createSpy('Fn');
    node = new TestNode(mockFn);
  });

  describe('execute', () => {
    it(`should return the correct value and update the cache`, () => {
      const context1 = Mocks.object('context1');
      const context2 = Mocks.object('context2');
      mockFn.and.callFake(([a, b]: number[]) => a + b);

      assert(node.execute(context1, [1, 2])).to.equal(3);
      assert(node.execute(context2, [3, 4])).to.equal(7);
      assert(node.getPreviousValue(context1)).to.equal(3);
      assert(node.getPreviousValue(context2)).to.equal(7);
    });
  });
});

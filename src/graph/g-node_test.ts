import { assert, Mocks, TestBase } from '../test-base';
TestBase.setup();

import { GraphTime } from '../graph';
import { GNode } from '../graph/g-node';
import { ImmutableList } from '../immutable';

class TestNode extends GNode<number> {
  constructor() {
    super(ImmutableList.of([]));
  }

  execute_(_: any, _2: any): number {
    throw new Error('unimplemented');
  }
}

describe('graph.GNode', () => {
  let node: TestNode;

  beforeEach(() => {
    node = new TestNode();
  });

  describe('addToCache_', () => {
    it(`should add to the cache correctly`, () => {
      const context = Mocks.object('context');
      const timestamp = Mocks.object('timestamp');
      const value = Mocks.object('value');

      node['addToCache_'](context, timestamp, value);
      assert(node['cacheMap_'].get(context)!.get(timestamp)!).to.equal(value);
    });

    it(`should throw error if the cache already has the timestamp`, () => {
      const context = Mocks.object('context');
      const timestamp = Mocks.object('timestamp');
      const value = Mocks.object('value');
      node['cacheMap_'].set(context, new Map([[timestamp, value]]));

      assert(() => {
        node['addToCache_'](context, timestamp, value);
      }).to.throwError(/have timestamp/);
    });
  });

  describe('execute', () => {
    it(`should return the correct value and update the cache`, () => {
      const context = Mocks.object('context');
      const params = Mocks.object('params');
      const timestamp = GraphTime.new();
      const value = Mocks.object('value');
      spyOn(node, 'execute_').and.returnValue(value);

      assert(node.execute(context, params, timestamp)).to.equal(value);
      assert(node['cacheMap_'].get(context)!.get(timestamp)!).to.equal(value);
      assert(node['execute_']).to.haveBeenCalledWith(context, params);
    });

    it(`should return the cached value if exists`, () => {
      const context = Mocks.object('context');
      const params = Mocks.object('params');
      const timestamp = GraphTime.new();
      const value = Mocks.object('value');
      node['cacheMap_'].set(context, new Map([[timestamp, value]]));
      spyOn(node, 'execute_');

      assert(node.execute(context, params, timestamp)).to.equal(value);
      assert(node['execute_']).toNot.haveBeenCalled();
    });
  });

  describe('getCache_', () => {
    it(`should return the existing correct cache`, () => {
      const context = Mocks.object('context');
      const cache = Mocks.object('cache');
      node['cacheMap_'].set(context, cache);

      assert(node['getCache_'](context)).to.equal(cache);
    });

    it(`should create and return the correct cache if none exists`, () => {
      const context = Mocks.object('context');

      const map = node['getCache_'](context);
      assert(node['cacheMap_'].get(context)!).to.be(map);
    });
  });

  describe('getLatestCacheValue', () => {
    it(`should return the correct value for time in the far future`, () => {
      const context = Mocks.object('context');
      const timestamp = new GraphTime(5);

      const timestamp1 = new GraphTime(1);
      const value1 = Mocks.object('value1');
      const timestamp2 = new GraphTime(2);
      const value2 = Mocks.object('value2');
      node['cacheMap_'].set(context, new Map([[timestamp1, value1], [timestamp2, value2]]));

      assert(node.getLatestCacheValue(context, timestamp)).to.equal([timestamp2, value2]);
    });

    it(`should return the correct value for time in the near past`, () => {
      const context = Mocks.object('context');
      const timestamp = new GraphTime(1.5);

      const timestamp1 = new GraphTime(1);
      const value1 = Mocks.object('value1');
      const timestamp2 = new GraphTime(2);
      const value2 = Mocks.object('value2');
      node['cacheMap_'].set(context, new Map([[timestamp1, value1], [timestamp2, value2]]));

      assert(node.getLatestCacheValue(context, timestamp)).to.equal([timestamp1, value1]);
    });

    it(`should return the correct value for time in the far past`, () => {
      const context = Mocks.object('context');
      const timestamp = new GraphTime(0);

      const timestamp1 = new GraphTime(1);
      const value1 = Mocks.object('value1');
      const timestamp2 = new GraphTime(2);
      const value2 = Mocks.object('value2');
      node['cacheMap_'].set(context, new Map([[timestamp1, value1], [timestamp2, value2]]));

      assert(node.getLatestCacheValue(context, timestamp)).to.beNull();
    });
  });
});

import { assert, Mocks, TestBase } from '../test-base';
TestBase.setup();

import { InnerNode } from '../graph/inner-node';
import { ImmutableList } from '../immutable';


describe('graph.InnerNode', () => {
  let mockFn: any;
  let node: InnerNode<number>;

  beforeEach(() => {
    mockFn = jasmine.createSpy('Fn');
    node = new InnerNode<number>(mockFn, ImmutableList.of([]));
  });

  describe('execute_', () => {
    it(`should evaluate and update the cache correctly`, () => {
      const context = Mocks.object('context');
      const params = [1, 2, 3];
      const value = 123;
      mockFn.and.returnValue(value);

      assert(node.execute_(context, params)).to.equal(value);
      assert(node['cache_']).to.equal({context, params, value});
      assert(mockFn).to.haveBeenCalledWith(...params);
    });

    it(`should return the cached value if exists`, () => {
      const context = Mocks.object('context');
      const params = [1, 2, 3];
      const value = 123;
      node['cache_'] = {context, params, value};

      assert(node.execute_(context, params)).to.equal(value);
      assert(mockFn).toNot.haveBeenCalled();
    });

    it(`should throw error if cache is inconsistent`, () => {
      const context = Mocks.object('context');
      const params = [1, 2, 3];
      node['cache_'] = null;
      spyOn(node, 'isCached').and.returnValue(true);

      assert(() => {
        node.execute_(context, params);
      }).to.throwError(/there are no caches/);
      assert(mockFn).toNot.haveBeenCalled();
      assert(node.isCached).to.haveBeenCalledWith(context, params);
    });
  });

  describe('isCached', () => {
    it(`should return true if the context and parameter values match`, () => {
      const context = Mocks.object('context');
      const params = [1, 2, 3];
      node['cache_'] = {context, params, value: 123};

      assert(node.isCached(context, params)).to.beTrue();
    });

    it(`should return false if the parameters are different`, () => {
      const context = Mocks.object('context');
      node['cache_'] = {context, params: [1, 2, 3], value: 123};

      assert(node.isCached(context, [4, 5, 6])).to.beFalse();
    });

    it(`should return false if the contexts are different`, () => {
      const params = [1, 2, 3];
      node['cache_'] = {context: Mocks.object('otherContext'), params, value: 123};

      assert(node.isCached(Mocks.object('context'), params)).to.beFalse();
    });

    it(`should return false if the cache is empty`, () => {
      assert(node.isCached(Mocks.object('context'), [1, 2, 3])).to.beFalse();
    });
  });
});

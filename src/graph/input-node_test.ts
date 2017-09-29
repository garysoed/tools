import { assert, Mocks, TestBase } from '../test-base';
TestBase.setup();

import { GraphTime } from '../graph';
import { GLOBALS } from '../graph/g-node';
import { InputNode } from '../graph/input-node';


describe('graph.InputNode', () => {
  const INIT_VALUE = 123;
  let node: InputNode<number>;

  beforeEach(() => {
    node = new InputNode<number>(INIT_VALUE);
  });

  describe('execute_', () => {
    it(`should return the value`, () => {
      const value = 456;
      const context = Mocks.object('context');
      context[node['symbol_']] = value;

      assert(node['execute_'](context)).to.equal(value);
    });

    it(`should return the init value if the value is undefined`, () => {
      const context = Mocks.object('context');

      assert(node['execute_'](context)).to.equal(INIT_VALUE);
    });
  });

  describe('set', () => {
    it(`should set the value and add it to the cache`, () => {
      const context = Mocks.object('context');
      const time = GraphTime.new();
      const value = 456;

      spyOn(node, 'addToCache_');

      node.set(context, time, value);
      assert(node['addToCache_']).to.haveBeenCalledWith(context, time, value);
      assert(node['execute_'](context)).to.equal(value);
    });

    it(`should handle null context correctly`, () => {
      const time = GraphTime.new();
      const value = 456;

      spyOn(node, 'addToCache_');

      node.set(null, time, value);
      assert(node['addToCache_']).to.haveBeenCalledWith(GLOBALS, time, value);
      assert(node['execute_'](GLOBALS)).to.equal(value);
    });
  });
});

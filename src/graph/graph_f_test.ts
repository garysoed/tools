import { assert, TestBase } from '../test-base';
TestBase.setup();

import { NumberType } from '../check';
import { Graph, NodeProvider, staticId } from '../graph';

const $ = {
  a: staticId<number>('a', NumberType),
  b: staticId<number>('b', NumberType),
  c: staticId<number>('c', NumberType),
};

describe('graph functional test', () => {
  beforeEach(() => {
    Graph.clearForTests();
  });

  describe('with static functions', () => {
    let providesB: NodeProvider<number>;
    let providesC: NodeProvider<number>;

    async function providesA(b: number): Promise<number> {
      const c = await Graph.get($.c);
      return b + c;
    }

    beforeEach(() => {
      Graph.registerProvider<number, number>($.a, providesA, $.b);
      providesB = Graph.createProvider($.b, 3);
      providesC = Graph.createProvider($.c, 4);
    });

    it(`should handle default values`, async () => {
      assert(await Graph.get($.a)).to.equal(7);
    });

    it(`should handle values set by the provider`, async () => {
      const setPromises = Promise.all([providesB(2), providesC(3)]);

      // At this point, the value hasn't been set yet.
      assert(await Graph.get($.a)).to.equal(7);

      await setPromises;
      assert(await Graph.get($.a)).to.equal(5);
    });
  });
});

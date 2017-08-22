import { assert, TestBase } from '../test-base';
TestBase.setup();

import { NumberType } from '../check';
import { Graph, instanceId, NodeProvider, staticId } from '../graph';

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

  describe('with instance functions without annotations', () => {
    class TestClass {
      constructor(private readonly b_: number) { }

      providesA(b: number, c: number): number {
        return b + c;
      }

      providesB(): number {
        return this.b_;
      }
    }

    const $a = instanceId('a', NumberType);
    const $b = instanceId('b', NumberType);
    let providesC: NodeProvider<number>;

    beforeEach(() => {
      Graph.registerProvider($a, TestClass.prototype.providesA, $b, $.c);
      Graph.registerProvider($b, TestClass.prototype.providesB);
      providesC = Graph.createProvider($.c, 3);
    });

    it(`should handle default values`, async () => {
      const test1 = new TestClass(1);
      const test2 = new TestClass(2);

      assert(await Graph.get($a, test1)).to.equal(4);
      assert(await Graph.get($a, test2)).to.equal(5);
    });

    it(`should cache the previous execution`, async () => {
      const providesASpy = spyOn(TestClass.prototype, 'providesA').and.callThrough();

      const test = new TestClass(1);
      assert(await Graph.get($a, test)).to.equal(4);

      providesASpy.calls.reset();
      assert(await Graph.get($a, test)).to.equal(4);

      assert(test.providesA).toNot.haveBeenCalled();
    });

    it(`should handle values set by the provider`, async () => {
      const test = new TestClass(2);
      const setPromise = providesC(5);

      // At this point, the value hasn't been set yet.
      assert(await Graph.get($a, test)).to.equal(5);

      await setPromise;
      assert(await Graph.get($a, test)).to.equal(7);
    });

    it(`should clear the cache if one of the providers have changed`, async () => {
      const test = new TestClass(2);
      const setPromise = providesC(5);
      const providesASpy = spyOn(TestClass.prototype, 'providesA').and.callThrough();

      // At this point, the value hasn't been set yet.
      assert(await Graph.get($a, test)).to.equal(5);
      providesASpy.calls.reset();
      assert(await Graph.get($a, test)).to.equal(5);
      assert(test.providesA).toNot.haveBeenCalled();

      await setPromise;
      assert(await Graph.get($a, test)).to.equal(7);
    });
  });
});

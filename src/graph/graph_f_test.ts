import { assert, Matchers, TestBase } from '../test-base';
TestBase.setup();

import { NumberType } from '../check';
import { BaseDisposable } from '../dispose';
import { eventDetails, listener } from '../event';
import { Graph, GraphEvent, instanceId, nodeIn, nodeOut, NodeProvider, staticId } from '../graph';
import { TestDispose } from '../testing';
import { Reflect } from '../util';

const $ = {
  a: staticId<number>('a', NumberType),
  b: staticId<number>('b', NumberType),
  c: staticId<number>('c', NumberType),
};

describe('graph functional test', () => {
  describe('with static functions', () => {
    let providesB: NodeProvider<number>;
    let providesC: NodeProvider<number>;

    async function providesA(b: number): Promise<number> {
      const c = await Graph.get($.c);
      return b + c;
    }

    beforeEach(() => {
      Graph.clearNodesForTests([$.a, $.b, $.c]);
      Graph.registerProvider<number, number>($.a, false, providesA, $.b);
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
    const $a = instanceId('a', NumberType);
    const $b = instanceId('b', NumberType);

    class TestClass {
      constructor(
          private readonly b_: number,
          private readonly providesASpy_: jasmine.Spy) { }

      providesA(b: number, c: number): number {
        this.providesASpy_(b, c);
        return b + c;
      }

      providesB(): number {
        return this.b_;
      }
    }
    let providesC: NodeProvider<number>;

    beforeEach(() => {
      Graph.clearNodesForTests([$a, $b, $.c]);
      Graph.registerProvider($a, false, TestClass.prototype.providesA, $b, $.c);
      Graph.registerProvider($b, false, TestClass.prototype.providesB);
      providesC = Graph.createProvider($.c, 3);
    });

    it(`should handle default values`, async () => {
      const test1 = new TestClass(1, jasmine.createSpy('ProvidesA1'));
      const test2 = new TestClass(2, jasmine.createSpy('ProvidesA2'));

      assert(await Graph.get($a, test1)).to.equal(4);
      assert(await Graph.get($a, test2)).to.equal(5);
    });

    it(`should cache the previous execution`, async () => {
      const providesASpy = jasmine.createSpy('ProvidesA');
      const test = new TestClass(1, providesASpy);
      assert(await Graph.get($a, test)).to.equal(4);

      providesASpy.calls.reset();
      assert(await Graph.get($a, test)).to.equal(4);

      assert(providesASpy).toNot.haveBeenCalled();
    });

    it(`should handle values set by the provider`, async () => {
      const test = new TestClass(2, jasmine.createSpy('ProvidesA'));
      const setPromise = providesC(5);

      // At this point, the value hasn't been set yet.
      assert(await Graph.get($a, test)).to.equal(5);

      await setPromise;
      assert(await Graph.get($a, test)).to.equal(7);
    });

    it(`should clear the cache if one of the providers have changed`, async () => {
      const test = new TestClass(2, jasmine.createSpy('ProvidesA'));
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

  describe('with instance functions with annotations', () => {
    const $a = instanceId('a', NumberType);
    const $b = instanceId('b', NumberType);

    class TestClass {
      constructor(
          private readonly b_: number,
          private readonly providesASpy_: jasmine.Spy) { }

      @nodeOut($a)
      providesA(@nodeIn($b) b: number, @nodeIn($.c) c: number): number {
        this.providesASpy_(b, c);
        return b + c;
      }

      @nodeOut($b)
      providesB(): number {
        return this.b_;
      }
    }

    let providesC: NodeProvider<number>;

    beforeEach(() => {
      Graph.clearNodesForTests([$.c]);
      providesC = Graph.createProvider($.c, 3);
    });

    it(`should handle default values`, async () => {
      const test1 = new TestClass(1, jasmine.createSpy('ProvidesA1'));
      const test2 = new TestClass(2, jasmine.createSpy('ProvidesA2'));

      assert(await Graph.get($a, test1)).to.equal(4);
      assert(await Graph.get($a, test2)).to.equal(5);
    });

    it(`should cache the previous execution`, async () => {
      const mockProvidesASpy = jasmine.createSpy('ProvidesASpy');

      const test = new TestClass(1, mockProvidesASpy);
      assert(await Graph.get($a, test)).to.equal(4);
      assert(mockProvidesASpy).to.haveBeenCalledWith(1, 3);

      mockProvidesASpy.calls.reset();
      assert(await Graph.get($a, test)).to.equal(4);

      assert(mockProvidesASpy).toNot.haveBeenCalled();
    });

    it(`should handle values set by the provider`, async () => {
      const test = new TestClass(2, jasmine.createSpy('ProvidesA'));
      const setPromise = providesC(5);

      // At this point, the value hasn't been set yet.
      assert(await Graph.get($a, test)).to.equal(5);

      await setPromise;
      assert(await Graph.get($a, test)).to.equal(7);
    });

    it(`should clear the cache if one of the providers have changed`, async () => {
      const mockProvidesASpy = jasmine.createSpy('ProvidesASpy');
      const test = new TestClass(2, mockProvidesASpy);
      const setPromise = providesC(5);

      // At this point, the value hasn't been set yet.
      assert(await Graph.get($a, test)).to.equal(5);
      mockProvidesASpy.calls.reset();
      assert(await Graph.get($a, test)).to.equal(5);
      assert(mockProvidesASpy).toNot.haveBeenCalled();

      await setPromise;
      assert(await Graph.get($a, test)).to.equal(7);
    });
  });

  describe('with graph event handling', () => {
    const $a = instanceId('a', NumberType);

    @listener()
    class TestClass extends BaseDisposable {
      constructor(
          private readonly b_: number,
          private readonly aChangeCallback_: jasmine.Spy,
          private readonly providesASpy_: jasmine.Spy) {
        super();
      }

      // @onNodeChange($a)
      onAChange(@eventDetails() event: GraphEvent<number, this>): void {
        this.aChangeCallback_(event);
      }

      @nodeOut($a, true)
      providesA(@nodeIn($.c) c: number): number {
        this.providesASpy_(c);
        return this.b_ + c;
      }
    }

    let providesC: NodeProvider<number>;

    beforeEach(() => {
      Graph.clearNodesForTests([$.c]);
      providesC = Graph.createProvider($.c, 2);
    });

    xit(`should call the callback correctly`, async () => {
      const mockCallback1 = jasmine.createSpy('Callback1');
      const t1 = Reflect.construct(
          TestClass,
          [1, mockCallback1, jasmine.createSpy('ProvidesASpy1')]);
      TestDispose.add(t1);

      const mockCallback2 = jasmine.createSpy('Callback2');
      const t2 = Reflect.construct(
          TestClass,
          [2, mockCallback2, jasmine.createSpy('ProvidesASpy1')]);
      TestDispose.add(t2);

      assert(await Promise.all([Graph.get($a, t1), Graph.get($a, t2)])).to.equal([3, 4]);

      providesC(3);
      assert(mockCallback1).to.haveBeenCalledWith(Matchers.objectContaining({
        context: t1,
        id: $a,
      }));
      assert(mockCallback2).to.haveBeenCalledWith(Matchers.objectContaining({
        context: t2,
        id: $a,
      }));
    });

    it(`should call providesA if $.c has changed`, async () => {
      const mockProvidesASpy = jasmine.createSpy('ProvidesASpy');

      const test = Reflect.construct(
          TestClass,
          [1, jasmine.createSpy('Callback'), mockProvidesASpy]);
      TestDispose.add(test);
      await Graph.get($a, test);
      assert(mockProvidesASpy).to.haveBeenCalledWith(2);

      const promise = new Promise((resolve) => {
        mockProvidesASpy.and.callFake(resolve);
      });

      providesC(4);

      await promise;
      assert(mockProvidesASpy).to.haveBeenCalledWith(4);
    });
  });
});

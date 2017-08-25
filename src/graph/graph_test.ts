import { assert, Fakes, Matchers, Mocks, TestBase } from '../test-base';
TestBase.setup();

import { NumberType } from '../check';
import { BaseDisposable } from '../dispose';
import { instanceId, staticId } from '../graph';
import { GraphImpl } from '../graph/graph';
import { InnerNode } from '../graph/inner-node';
import { InputNode } from '../graph/input-node';
import { ImmutableList, ImmutableSet } from '../immutable';
import { TestDispose } from '../testing';
import { Log } from '../util';


describe('graph.Graph', () => {
  let graph: GraphImpl;

  beforeEach(() => {
    graph = new GraphImpl(Log.of('test'));
    TestDispose.add(graph);
  });

  describe('createProvider', () => {
    it(`should create the correct provider`, () => {
      const $ = staticId('id', NumberType);
      const value = 123;
      const promise = Mocks.object('promise');
      spyOn(graph, 'set_').and.returnValue(promise);

      const provider = graph.createProvider($, value);
      assert(graph['nodes_'].get($)!.execute(null, [])).to.equal(value);

      const newValue = 456;
      assert(provider(newValue)).to.equal(promise);
      assert(graph['set_']).to.haveBeenCalledWith($, newValue);
    });

    it(`should throw error if the node is already registered`, () => {
      const $ = staticId('id', NumberType);
      const value = 123;
      graph['nodes_'].set($, Mocks.object('node'));

      assert(() => {
        graph.createProvider($, value);
      }).to.throwError(/already registered/);
    });
  });

  describe('get', () => {
    it(`should return the correct value`, async () => {
      const $ = {
        param1: staticId('param1', NumberType),
        param2: staticId('param2', NumberType),
        test: staticId('test', NumberType),
      };
      const value = 123;

      const param1 = 456;
      const param2 = 789;
      const origGet = graph.get;
      Fakes.build(spyOn(graph, 'get'))
          .when($.param1).resolve(param1)
          .when($.param2).resolve(param2)
          .else().call(origGet.bind(graph));
      const mockNode = jasmine
          .createSpyObj('Node', ['execute', 'getPreviousValue', 'getParameterIds']);
      mockNode.execute.and.returnValue(Promise.resolve(value));
      mockNode.getParameterIds.and.returnValue(ImmutableList.of([$.param1, $.param2]));
      Object.setPrototypeOf(mockNode, InnerNode.prototype);
      graph['nodes_'].set($.test, mockNode);

      spyOn(graph, 'dispatch');

      await assert(graph.get($.test)).to.resolveWith(value);
      assert(mockNode.execute).to.haveBeenCalledWith(null, [param1, param2]);
      assert(graph.dispatch).to.haveBeenCalledWith({context: null, id: $.test, type: 'change'});
    });

    it(`should handle instance IDs`, async () => {
      class TestClass extends BaseDisposable {
        constructor() {
          super();
        }
      }

      const instance = new TestClass();
      TestDispose.add(instance);

      const $ = {
        param1: instanceId('param1', NumberType),
        param2: instanceId('param2', NumberType),
        test: instanceId('test', NumberType),
      };
      const value = 123;

      const param1 = 456;
      const param2 = 789;
      const origGet = graph.get;
      Fakes.build(spyOn(graph, 'get'))
          .when($.param1).resolve(param1)
          .when($.param2).resolve(param2)
          .else().call(origGet.bind(graph));
      const mockNode = jasmine.createSpyObj(
          'Node',
          ['execute', 'getPreviousValue', 'getParameterIds', 'monitorsChanges']);
      mockNode.execute.and.returnValue(Promise.resolve(value));
      mockNode.getParameterIds.and.returnValue(ImmutableList.of([$.param1, $.param2]));
      mockNode.monitorsChanges.and.returnValue(true);
      Object.setPrototypeOf(mockNode, InnerNode.prototype);
      graph['nodes_'].set($.test, mockNode);

      const graphOnSpy = spyOn(graph, 'on')
          .and.returnValue(jasmine.createSpyObj('disposable', ['dispose']));
      spyOn(graph, 'onChange_');

      await assert(graph.get($.test, instance)).to.resolveWith(value);
      assert(mockNode.execute).to.haveBeenCalledWith(instance, [param1, param2]);
      assert(graph['monitoredNodes_'].get(instance)!).to.haveElements([$.test]);
      assert(graph.on).to.haveBeenCalledWith('change', Matchers.any(Function) as any, graph);

      const event = Mocks.object('event');
      graphOnSpy.calls.argsFor(0)[1](event);
      assert(graph['onChange_']).to.haveBeenCalledWith($.test, mockNode, instance, event);

      assert(graph.get).to.haveBeenCalledWith($.param1, instance);
      assert(graph.get).to.haveBeenCalledWith($.param2, instance);
    });

    it(`should reject if the value has the wrong type`, async () => {
      const $ = {
        param: staticId('param', NumberType),
        test: staticId('test', NumberType),
      };
      const value = 'abc';

      const param = 456;
      const origGet = graph.get;
      Fakes.build(spyOn(graph, 'get'))
          .when($.param).resolve(param)
          .else().call(origGet.bind(graph));
      const mockNode = jasmine
          .createSpyObj('Node', ['execute', 'getPreviousValue', 'getParameterIds']);
      mockNode.execute.and.returnValue(Promise.resolve(value));
      mockNode.getParameterIds.and.returnValue(ImmutableList.of([$.param]));
      graph['nodes_'].set($.test, mockNode);

      await assert(graph.get($.test)).to.rejectWithError(/incorrect type/);
      assert(mockNode.execute).to.haveBeenCalledWith(null, [param]);
    });

    it(`should reject if the node corresponding to the ID cannot be found`, async () => {
      const $ = {
        test: staticId('test', NumberType),
      };

      await assert(graph.get($.test)).to.rejectWithError(/cannot be found/);
    });

    it(`should not monitor if already monitored`, async () => {
      class TestClass extends BaseDisposable {
        constructor() {
          super();
        }
      }

      const instance = new TestClass();
      TestDispose.add(instance);

      const $test = instanceId('test', NumberType);
      const value = 123;

      const mockNode = jasmine.createSpyObj(
          'Node',
          ['execute', 'getPreviousValue', 'getParameterIds', 'monitorsChanges']);
      mockNode.execute.and.returnValue(value);
      mockNode.getParameterIds.and.returnValue(ImmutableList.of([]));
      mockNode.monitorsChanges.and.returnValue(true);
      Object.setPrototypeOf(mockNode, InnerNode.prototype);
      graph['nodes_'].set($test, mockNode);

      spyOn(graph, 'on');
      spyOn(graph, 'onChange_');
      spyOn(graph, 'isMonitored_').and.returnValue(true);

      await assert(graph.get($test, instance)).to.resolveWith(value);
      assert(graph.on).toNot.haveBeenCalled();
      assert(graph['isMonitored_']).to.haveBeenCalledWith(instance, $test);
    });

    it(`should not monitor if the node is not set up to monitor changes`, async () => {
      class TestClass extends BaseDisposable {
        constructor() {
          super();
        }
      }

      const instance = new TestClass();
      TestDispose.add(instance);

      const $test = instanceId('test', NumberType);
      const value = 123;

      const mockNode = jasmine.createSpyObj(
          'Node',
          ['execute', 'getPreviousValue', 'getParameterIds', 'monitorsChanges']);
      mockNode.execute.and.returnValue(value);
      mockNode.getParameterIds.and.returnValue(ImmutableList.of([]));
      mockNode.monitorsChanges.and.returnValue(false);
      Object.setPrototypeOf(mockNode, InnerNode.prototype);
      graph['nodes_'].set($test, mockNode);

      spyOn(graph, 'on');
      spyOn(graph, 'onChange_');

      await assert(graph.get($test, instance)).to.resolveWith(value);
      assert(graph.on).toNot.haveBeenCalled();
    });

    it(`should not monitor if node is not InnerNode`, async () => {
      class TestClass extends BaseDisposable {
        constructor() {
          super();
        }
      }

      const instance = new TestClass();
      TestDispose.add(instance);

      const $test = instanceId('test', NumberType);
      const value = 123;

      const mockNode = jasmine.createSpyObj(
          'Node',
          ['execute', 'getPreviousValue', 'getParameterIds', 'monitorsChanges']);
      mockNode.execute.and.returnValue(value);
      mockNode.getParameterIds.and.returnValue(ImmutableList.of([]));
      graph['nodes_'].set($test, mockNode);

      spyOn(graph, 'on');
      spyOn(graph, 'onChange_');

      await assert(graph.get($test, instance)).to.resolveWith(value);
      assert(graph.on).toNot.haveBeenCalled();
    });

    it(`should not monitor if the nodeId is not InstanceId`, async () => {
      const $test = staticId('test', NumberType);
      const value = 123;

      const mockNode = jasmine.createSpyObj(
          'Node',
          ['execute', 'getPreviousValue', 'getParameterIds', 'monitorsChanges']);
      mockNode.execute.and.returnValue(value);
      mockNode.getParameterIds.and.returnValue(ImmutableList.of([]));
      graph['nodes_'].set($test, mockNode);

      spyOn(graph, 'on');
      spyOn(graph, 'onChange_');

      await assert(graph.get($test)).to.resolveWith(value);
      assert(graph.on).toNot.haveBeenCalled();
    });

    it(`should not monitor if the context is not BaseDisposable`, async () => {
      class TestClass { }

      const instance = new TestClass();
      const $test = instanceId('test', NumberType);
      const value = 123;

      const mockNode = jasmine.createSpyObj(
          'Node',
          ['execute', 'getPreviousValue', 'getParameterIds', 'monitorsChanges']);
      mockNode.execute.and.returnValue(value);
      mockNode.getParameterIds.and.returnValue(ImmutableList.of([]));
      graph['nodes_'].set($test, mockNode);

      spyOn(graph, 'on');
      spyOn(graph, 'onChange_');

      await assert(graph.get($test, instance)).to.resolveWith(value);
      assert(graph.on).toNot.haveBeenCalled();
    });

    it(`should not monitor if the context is null`, async () => {
      const $test = instanceId('test', NumberType);
      const value = 123;

      const mockNode = jasmine.createSpyObj(
          'Node',
          ['execute', 'getPreviousValue', 'getParameterIds', 'monitorsChanges']);
      mockNode.execute.and.returnValue(value);
      mockNode.getParameterIds.and.returnValue(ImmutableList.of([]));
      graph['nodes_'].set($test, mockNode);

      spyOn(graph, 'on');
      spyOn(graph, 'onChange_');

      await assert(graph.get($test, null)).to.resolveWith(value);
      assert(graph.on).toNot.haveBeenCalled();
    });

    it(`should not dispatch any events if the new value is the same as the cached one`,
        async () => {
      const $ = {
        test: staticId('test', NumberType),
      };
      const value = 123;

      const mockNode = jasmine
          .createSpyObj('Node', ['execute', 'getPreviousValue', 'getParameterIds']);
      mockNode.execute.and.returnValue(value);
      mockNode.getParameterIds.and.returnValue(ImmutableList.of([]));
      mockNode.getPreviousValue.and.returnValue(value);
      Object.setPrototypeOf(mockNode, InnerNode.prototype);
      graph['nodes_'].set($.test, mockNode);

      spyOn(graph, 'dispatch');

      await assert(graph.get($.test)).to.resolveWith(value);
      assert(mockNode.execute).to.haveBeenCalledWith(null, []);
      assert(graph.dispatch).toNot.haveBeenCalled();
    });
  });

  describe('isMonitored_', () => {
    it(`should return true if the ID is monitored`, () => {
      const context = Mocks.object('context');
      const nodeId = instanceId('test', NumberType);
      graph['monitoredNodes_'].set(context, ImmutableSet.of([nodeId]));

      assert(graph['isMonitored_'](context, nodeId)).to.beTrue();
    });

    it(`should return false if the ID is not monitored for the context`, () => {
      const context = Mocks.object('context');
      const nodeId = instanceId('test', NumberType);
      graph['monitoredNodes_'].set(context, ImmutableSet.of([instanceId('other', NumberType)]));

      assert(graph['isMonitored_'](context, nodeId)).to.beFalse();
    });

    it(`should return false if the context is not monitored`, () => {
      const context = Mocks.object('context');
      const nodeId = instanceId('test', NumberType);

      assert(graph['isMonitored_'](context, nodeId)).to.beFalse();
    });
  });

  describe('onChange_', () => {
    it(`should get the new value`, () => {
      const nodeId = instanceId('test', NumberType);
      const paramId = staticId('param', NumberType);
      const mockNode = jasmine.createSpyObj('Node', ['clearCache', 'getParameterIds']);
      mockNode.getParameterIds.and.returnValue([paramId]);

      const context = Mocks.object('context');
      const graphEvent = Mocks.object('graphEvent');
      graphEvent.id = paramId;

      spyOn(graph, 'get');

      graph['onChange_'](nodeId, mockNode, context, graphEvent);
      assert(graph.get).to.haveBeenCalledWith(nodeId, context);
      assert(mockNode.clearCache).to.haveBeenCalledWith(context);
    });

    it(`should do nothing if the changed ID is not a parameter`, () => {
      const nodeId = instanceId('test', NumberType);
      const paramId = staticId('param', NumberType);
      const mockNode = jasmine.createSpyObj('Node', ['getParameterIds']);
      mockNode.getParameterIds.and.returnValue([]);

      const context = Mocks.object('context');
      const graphEvent = Mocks.object('graphEvent');
      graphEvent.id = paramId;

      spyOn(graph, 'get');

      graph['onChange_'](nodeId, mockNode, context, graphEvent);
      assert(graph.get).toNot.haveBeenCalled();
    });
  });

  describe('processSetQueue_', () => {
    it(`should process all the items in the queue and clear it`, () => {
      const mockSetFn1 = jasmine.createSpy('SetFn1');
      const mockSetFn2 = jasmine.createSpy('SetFn2');
      graph['setQueue_'].push(mockSetFn1, mockSetFn2);

      graph['processSetQueue_']();
      assert(graph['setQueue_']).to.equal([]);
      assert(mockSetFn1).to.haveBeenCalledWith();
      assert(mockSetFn2).to.haveBeenCalledWith();
    });
  });

  describe('registerProvider', () => {
    it(`should register the correct node`, () => {
      const $ = staticId('test', NumberType);
      const value = 123;
      const mockProvider = jasmine.createSpy('Provider');
      mockProvider.and.returnValue(value);

      graph.registerProvider($, true, mockProvider);
      const node = graph['nodes_'].get($)! as InnerNode<number>;
      assert(node.execute(null, [])).to.equal(value);
      assert(node.monitorsChanges()).to.beTrue();
      assert(mockProvider).to.haveBeenCalledWith();
    });

    it(`should throw error if the node is already registered`, () => {
      const $ = staticId('test', NumberType);
      const node = Mocks.object('node');
      graph['nodes_'].set($, node);

      assert(() => {
        graph.registerProvider($, true, Mocks.object('provider'));
      }).to.throwError(/already registered/);
    });
  });

  describe('set_', () => {
    it(`should return promise that is resolved after the set functions are called`, async () => {
      const $ = staticId('test', NumberType);
      const value = 123;
      const mockNode = jasmine.createSpyObj('Node', ['set']);
      Object.setPrototypeOf(mockNode, InputNode.prototype);
      graph['nodes_'].set($, mockNode);

      await graph['set_']($, value);
      assert(mockNode.set).to.haveBeenCalledWith(null, value);
    });

    it(`should throw error if the corresponding node is not an InputNode`, () => {
      const $ = staticId('test', NumberType);
      const mockNode = jasmine.createSpyObj('Node', ['set']);
      graph['nodes_'].set($, mockNode);

      assert(() => {
        graph['set_']($, 123);
      }).to.throwError(/not an instance of InputNode/);
    });
  });
});

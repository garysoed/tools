import { assert, Fakes, Matchers, Mocks, TestBase } from '../test-base';
TestBase.setup();

import { NumberType } from '../check';
import { BaseDisposable } from '../dispose';
import { Graph, instanceId, staticId } from '../graph';
import { MONITORED_NODES, NODES, SET_QUEUE } from '../graph/graph';
import { InnerNode } from '../graph/inner-node';
import { InputNode } from '../graph/input-node';
import { ImmutableList, ImmutableSet } from '../immutable';
import { TestDispose } from '../testing';


describe('graph.Graph', () => {
  beforeEach(() => {
    Graph.clearForTests();
  });

  describe('createProvider', () => {
    it(`should create the correct provider`, () => {
      const $ = staticId('id', NumberType);
      const value = 123;
      const promise = Mocks.object('promise');
      spyOn(Graph, 'set_').and.returnValue(promise);

      const provider = Graph.createProvider($, value);
      assert(NODES.get($)!.execute(null, [])).to.equal(value);

      const newValue = 456;
      assert(provider(newValue)).to.equal(promise);
      assert(Graph['set_']).to.haveBeenCalledWith($, newValue);
    });

    it(`should throw error if the node is already registered`, () => {
      const $ = staticId('id', NumberType);
      const value = 123;
      NODES.set($, Mocks.object('node'));

      assert(() => {
        Graph.createProvider($, value);
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
      const origGet = Graph.get;
      Fakes.build(spyOn(Graph, 'get'))
          .when($.param1).resolve(param1)
          .when($.param2).resolve(param2)
          .else().call(origGet.bind(Graph));
      const mockNode = jasmine.createSpyObj('Node', ['execute', 'getParameterIds']);
      mockNode.execute.and.returnValue(value);
      mockNode.getParameterIds.and.returnValue(ImmutableList.of([$.param1, $.param2]));
      NODES.set($.test, mockNode);

      await assert(Graph.get($.test)).to.resolveWith(value);
      assert(mockNode.execute).to.haveBeenCalledWith(null, [param1, param2]);
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
      const origGet = Graph.get;
      Fakes.build(spyOn(Graph, 'get'))
          .when($.param1).resolve(param1)
          .when($.param2).resolve(param2)
          .else().call(origGet.bind(Graph));
      const mockNode = jasmine.createSpyObj(
          'Node',
          ['execute', 'getParameterIds', 'monitorsChanges']);
      mockNode.execute.and.returnValue(value);
      mockNode.getParameterIds.and.returnValue(ImmutableList.of([$.param1, $.param2]));
      mockNode.monitorsChanges.and.returnValue(true);
      Object.setPrototypeOf(mockNode, InnerNode.prototype);
      NODES.set($.test, mockNode);

      const graphOnSpy = spyOn(Graph, 'on')
          .and.returnValue(jasmine.createSpyObj('disposable', ['dispose']));
      spyOn(Graph, 'onChange_');

      await assert(Graph.get($.test, instance)).to.resolveWith(value);
      assert(mockNode.execute).to.haveBeenCalledWith(instance, [param1, param2]);
      assert(MONITORED_NODES.get(instance)!).to.haveElements([$.test]);
      assert(Graph.on).to.haveBeenCalledWith('change', Matchers.any(Function) as any, Graph);

      const event = Mocks.object('event');
      graphOnSpy.calls.argsFor(0)[1](event);
      assert(Graph['onChange_']).to.haveBeenCalledWith($.test, mockNode, instance, event);

      assert(Graph.get).to.haveBeenCalledWith($.param1, instance);
      assert(Graph.get).to.haveBeenCalledWith($.param2, instance);
    });

    it(`should reject if the value has the wrong type`, async () => {
      const $ = {
        param: staticId('param', NumberType),
        test: staticId('test', NumberType),
      };
      const value = 'abc';

      const param = 456;
      const origGet = Graph.get;
      Fakes.build(spyOn(Graph, 'get'))
          .when($.param).resolve(param)
          .else().call(origGet.bind(Graph));
      const mockNode = jasmine.createSpyObj('Node', ['execute', 'getParameterIds']);
      mockNode.execute.and.returnValue(value);
      mockNode.getParameterIds.and.returnValue(ImmutableList.of([$.param]));
      NODES.set($.test, mockNode);

      await assert(Graph.get($.test)).to.rejectWithError(/incorrect type/);
      assert(mockNode.execute).to.haveBeenCalledWith(null, [param]);
    });

    it(`should reject if the node corresponding to the ID cannot be found`, async () => {
      const $ = {
        test: staticId('test', NumberType),
      };

      await assert(Graph.get($.test)).to.rejectWithError(/cannot be found/);
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
          ['execute', 'getParameterIds', 'monitorsChanges']);
      mockNode.execute.and.returnValue(value);
      mockNode.getParameterIds.and.returnValue(ImmutableList.of([]));
      mockNode.monitorsChanges.and.returnValue(true);
      Object.setPrototypeOf(mockNode, InnerNode.prototype);
      NODES.set($test, mockNode);

      spyOn(Graph, 'on');
      spyOn(Graph, 'onChange_');
      spyOn(Graph, 'isMonitored_').and.returnValue(true);

      await assert(Graph.get($test, instance)).to.resolveWith(value);
      assert(Graph.on).toNot.haveBeenCalled();
      assert(Graph['isMonitored_']).to.haveBeenCalledWith(instance, $test);
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
          ['execute', 'getParameterIds', 'monitorsChanges']);
      mockNode.execute.and.returnValue(value);
      mockNode.getParameterIds.and.returnValue(ImmutableList.of([]));
      mockNode.monitorsChanges.and.returnValue(false);
      Object.setPrototypeOf(mockNode, InnerNode.prototype);
      NODES.set($test, mockNode);

      spyOn(Graph, 'on');
      spyOn(Graph, 'onChange_');

      await assert(Graph.get($test, instance)).to.resolveWith(value);
      assert(Graph.on).toNot.haveBeenCalled();
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
          ['execute', 'getParameterIds', 'monitorsChanges']);
      mockNode.execute.and.returnValue(value);
      mockNode.getParameterIds.and.returnValue(ImmutableList.of([]));
      NODES.set($test, mockNode);

      spyOn(Graph, 'on');
      spyOn(Graph, 'onChange_');

      await assert(Graph.get($test, instance)).to.resolveWith(value);
      assert(Graph.on).toNot.haveBeenCalled();
    });

    it(`should not monitor if the nodeId is not InstanceId`, async () => {
      const $test = staticId('test', NumberType);
      const value = 123;

      const mockNode = jasmine.createSpyObj(
          'Node',
          ['execute', 'getParameterIds', 'monitorsChanges']);
      mockNode.execute.and.returnValue(value);
      mockNode.getParameterIds.and.returnValue(ImmutableList.of([]));
      NODES.set($test, mockNode);

      spyOn(Graph, 'on');
      spyOn(Graph, 'onChange_');

      await assert(Graph.get($test)).to.resolveWith(value);
      assert(Graph.on).toNot.haveBeenCalled();
    });

    it(`should not monitor if the context is not BaseDisposable`, async () => {
      class TestClass { }

      const instance = new TestClass();
      const $test = instanceId('test', NumberType);
      const value = 123;

      const mockNode = jasmine.createSpyObj(
          'Node',
          ['execute', 'getParameterIds', 'monitorsChanges']);
      mockNode.execute.and.returnValue(value);
      mockNode.getParameterIds.and.returnValue(ImmutableList.of([]));
      NODES.set($test, mockNode);

      spyOn(Graph, 'on');
      spyOn(Graph, 'onChange_');

      await assert(Graph.get($test, instance)).to.resolveWith(value);
      assert(Graph.on).toNot.haveBeenCalled();
    });

    it(`should not monitor if the context is null`, async () => {
      const $test = instanceId('test', NumberType);
      const value = 123;

      const mockNode = jasmine.createSpyObj(
          'Node',
          ['execute', 'getParameterIds', 'monitorsChanges']);
      mockNode.execute.and.returnValue(value);
      mockNode.getParameterIds.and.returnValue(ImmutableList.of([]));
      NODES.set($test, mockNode);

      spyOn(Graph, 'on');
      spyOn(Graph, 'onChange_');

      await assert(Graph.get($test, null)).to.resolveWith(value);
      assert(Graph.on).toNot.haveBeenCalled();
    });
  });

  describe('isMonitored_', () => {
    it(`should return true if the ID is monitored`, () => {
      const context = Mocks.object('context');
      const nodeId = instanceId('test', NumberType);
      MONITORED_NODES.set(context, ImmutableSet.of([nodeId]));

      assert(Graph['isMonitored_'](context, nodeId)).to.beTrue();
    });

    it(`should return false if the ID is not monitored for the context`, () => {
      const context = Mocks.object('context');
      const nodeId = instanceId('test', NumberType);
      MONITORED_NODES.set(context, ImmutableSet.of([instanceId('other', NumberType)]));

      assert(Graph['isMonitored_'](context, nodeId)).to.beFalse();
    });

    it(`should return false if the context is not monitored`, () => {
      const context = Mocks.object('context');
      const nodeId = instanceId('test', NumberType);

      assert(Graph['isMonitored_'](context, nodeId)).to.beFalse();
    });
  });

  describe('onChange_', () => {
    it(`should get the new value`, () => {
      const nodeId = instanceId('test', NumberType);
      const paramId = staticId('param', NumberType);
      const mockNode = jasmine.createSpyObj('Node', ['getParameterIds']);
      mockNode.getParameterIds.and.returnValue([paramId]);

      const context = Mocks.object('context');
      const graphEvent = Mocks.object('graphEvent');
      graphEvent.id = paramId;

      spyOn(Graph, 'get');

      Graph['onChange_'](nodeId, mockNode, context, graphEvent);
      assert(Graph.get).to.haveBeenCalledWith(nodeId, context);
    });

    it(`should do nothing if the changed ID is not a parameter`, () => {
      const nodeId = instanceId('test', NumberType);
      const paramId = staticId('param', NumberType);
      const mockNode = jasmine.createSpyObj('Node', ['getParameterIds']);
      mockNode.getParameterIds.and.returnValue([]);

      const context = Mocks.object('context');
      const graphEvent = Mocks.object('graphEvent');
      graphEvent.id = paramId;

      spyOn(Graph, 'get');

      Graph['onChange_'](nodeId, mockNode, context, graphEvent);
      assert(Graph.get).toNot.haveBeenCalled();
    });
  });

  describe('processSetQueue_', () => {
    it(`should process all the items in the queue and clear it`, () => {
      const mockSetFn1 = jasmine.createSpy('SetFn1');
      const mockSetFn2 = jasmine.createSpy('SetFn2');
      SET_QUEUE.push(mockSetFn1, mockSetFn2);

      Graph['processSetQueue_']();
      assert(SET_QUEUE).to.equal([]);
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

      Graph.registerProvider($, true, mockProvider);
      const node = NODES.get($)! as InnerNode<number>;
      assert(node.execute(null, [])).to.equal(value);
      assert(node.monitorsChanges()).to.beTrue();
      assert(mockProvider).to.haveBeenCalledWith();
    });

    it(`should throw error if the node is already registered`, () => {
      const $ = staticId('test', NumberType);
      const node = Mocks.object('node');
      NODES.set($, node);

      assert(() => {
        Graph.registerProvider($, true, Mocks.object('provider'));
      }).to.throwError(/already registered/);
    });
  });

  describe('set_', () => {
    it(`should return promise that is resolved after the set functions are called`, async () => {
      const $ = staticId('test', NumberType);
      const value = 123;
      const mockNode = jasmine.createSpyObj('Node', ['set']);
      Object.setPrototypeOf(mockNode, InputNode.prototype);
      NODES.set($, mockNode);

      await Graph['set_']($, value);
      assert(mockNode.set).to.haveBeenCalledWith(null, value);
    });

    it(`should throw error if the corresponding node is not an InputNode`, () => {
      const $ = staticId('test', NumberType);
      const mockNode = jasmine.createSpyObj('Node', ['set']);
      NODES.set($, mockNode);

      assert(() => {
        Graph['set_']($, 123);
      }).to.throwError(/not an instance of InputNode/);
    });
  });
});

import { assert, Fakes, Mocks, TestBase } from '../test-base';
TestBase.setup();

import { NumberType } from '../check';
import { Graph, staticId } from '../graph';
import { setQueue, staticNodes } from '../graph/graph';
import { InputNode } from '../graph/input-node';
import { ImmutableList } from '../immutable';


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
      assert(staticNodes.get($)!.execute([])).to.equal(value);

      const newValue = 456;
      assert(provider(newValue)).to.equal(promise);
      assert(Graph['set_']).to.haveBeenCalledWith($, newValue);
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
          .else().call((id: any) => origGet(id));
      const mockNode = jasmine.createSpyObj('Node', ['execute', 'getParameterIds']);
      mockNode.execute.and.returnValue(value);
      mockNode.getParameterIds.and.returnValue(ImmutableList.of([$.param1, $.param2]));
      staticNodes.set($.test, mockNode);

      await assert(Graph.get($.test)).to.resolveWith(value);
      assert(mockNode.execute).to.haveBeenCalledWith([param1, param2]);
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
          .else().call((id: any) => origGet(id));
      const mockNode = jasmine.createSpyObj('Node', ['execute', 'getParameterIds']);
      mockNode.execute.and.returnValue(value);
      mockNode.getParameterIds.and.returnValue(ImmutableList.of([$.param]));
      staticNodes.set($.test, mockNode);

      await assert(Graph.get($.test)).to.rejectWithError(/incorrect type/);
      assert(mockNode.execute).to.haveBeenCalledWith([param]);
    });

    it(`should reject if the node corresponding to the ID cannot be found`, async () => {
      const $ = {
        test: staticId('test', NumberType),
      };

      await assert(Graph.get($.test)).to.rejectWithError(/cannot be found/);
    });
  });

  describe('processSetQueue_', () => {
    it(`should process all the items in the queue and clear it`, () => {
      const mockSetFn1 = jasmine.createSpy('SetFn1');
      const mockSetFn2 = jasmine.createSpy('SetFn2');
      setQueue.push(mockSetFn1, mockSetFn2);

      Graph['processSetQueue_']();
      assert(setQueue).to.equal([]);
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

      Graph.registerProvider($, mockProvider);
      assert(staticNodes.get($)!.execute([])).to.equal(value);
      assert(mockProvider).to.haveBeenCalledWith();
    });

    it(`should throw error if the node is already registered`, () => {
      const $ = staticId('test', NumberType);
      const node = Mocks.object('node');
      staticNodes.set($, node);

      assert(() => {
        Graph.registerProvider($, Mocks.object('provider'));
      }).to.throwError(/already registered/);
    });
  });

  describe('set_', () => {
    it(`should return promise that is resolved after the set functions are called`, async () => {
      const $ = staticId('test', NumberType);
      const value = 123;
      const mockNode = jasmine.createSpyObj('Node', ['set']);
      Object.setPrototypeOf(mockNode, InputNode.prototype);
      staticNodes.set($, mockNode);

      await Graph['set_']($, value);
      assert(mockNode.set).to.haveBeenCalledWith(value);
    });

    it(`should throw error if the corresponding node is not an InputNode`, () => {
      const $ = staticId('test', NumberType);
      const mockNode = jasmine.createSpyObj('Node', ['set']);
      staticNodes.set($, mockNode);

      assert(() => {
        Graph['set_']($, 123);
      }).to.throwError(/not an instance of InputNode/);
    });
  });
});

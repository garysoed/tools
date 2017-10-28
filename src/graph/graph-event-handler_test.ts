import { assert, Matchers, Mocks, TestBase } from '../test-base';
TestBase.setup();

import { NumberType } from '../check';
import { instanceId } from '../graph';
import { GraphEventHandler } from '../graph/graph-event-handler';
import { TestDispose } from '../testing';

describe('graph/graph-event-handler.GraphEventHandler', () => {
  let handler: GraphEventHandler;

  beforeEach(() => {
    handler = new GraphEventHandler();
    TestDispose.add(handler);
  });

  describe('callHandlers_', () => {
    it(`should call the handlers`, () => {
      const listeners = Mocks.object('listeners');
      const context = Mocks.object('context');
      const id = instanceId('test', NumberType);
      const type = 'change';

      const mockHandler1 = jasmine.createSpy('Handler1');
      const mockHandler2 = jasmine.createSpy('Handler2');
      spyOn(handler, 'getHandlers_').and.returnValue(new Set([mockHandler1, mockHandler2]));

      handler['callHandlers_'](listeners, context, id, type);
      const event = {context, id, type};
      assert(mockHandler1).to.haveBeenCalledWith(event);
      assert(mockHandler2).to.haveBeenCalledWith(event);
      assert(handler['getHandlers_']).to.haveBeenCalledWith(listeners, context, id);
    });

    it(`should not throw if there are no handlers`, () => {
      const listeners = Mocks.object('listeners');
      const context = Mocks.object('context');
      const id = instanceId('test', NumberType);
      const type = 'change';

      spyOn(handler, 'getHandlers_').and.returnValue(new Set());

      assert(() => {
        handler['callHandlers_'](listeners, context, id, type);
      }).toNot.throw();
    });
  });

  describe('dispatchChange', () => {
    it(`should call the handlers correctly`, () => {
      const id = instanceId('test', NumberType);
      const context = Mocks.object('context');

      spyOn(handler, 'callHandlers_');

      handler.dispatchChange(id, context);
      assert(handler['callHandlers_']).to
          .haveBeenCalledWith(handler['onChangeListeners_'], context, id, 'change');
    });
  });

  describe('dispatchReady', () => {
    it(`should call the handlers correctly`, () => {
      const id = instanceId('test', NumberType);
      const context = Mocks.object('context');

      spyOn(handler, 'callHandlers_');

      handler.dispatchReady(id, context);
      assert(handler['callHandlers_']).to
          .haveBeenCalledWith(handler['onReadyListeners_'], context, id, 'ready');
    });
  });

  describe('getHandlers_', () => {
    it(`should return the correct handlers`, () => {
      const id = instanceId('test', NumberType);
      const context = Mocks.object('context');
      const handler1 = Mocks.object('handler1');
      const handler2 = Mocks.object('handler2');
      const listeners = new WeakMap();
      listeners.set(context, new Map([[id, new Set([handler1, handler2])]]));

      assert(handler['getHandlers_'](listeners, context, id)!).to
          .haveElements([handler1, handler2]);
    });

    it(`should return null if there are no handlers for the node ID`, () => {
      const id = instanceId('test', NumberType);
      const context = Mocks.object('context');
      const listeners = new WeakMap();
      listeners.set(context, new Map());

      assert(handler['getHandlers_'](listeners, context, id)).to.beNull();
    });

    it(`should return null if there are no maps for the context`, () => {
      const id = instanceId('test', NumberType);
      const context = Mocks.object('context');
      const listeners = new WeakMap();

      assert(handler['getHandlers_'](listeners, context, id)).to.beNull();
    });
  });

  describe('modifyHandlers_', () => {
    it(`should call the function and reuse existing maps`, () => {
      const id = instanceId('test', NumberType);
      const context = Mocks.object('context');
      const handlers = new Set();
      const map = new Map([[id, handlers]]);
      const listeners = new WeakMap();
      listeners.set(context, map);

      const mockFn = jasmine.createSpy('Fn');
      const newHandler = Mocks.object('newHandler');
      mockFn.and.callFake((handlers: Set<any>) => handlers.add(newHandler));

      handler['modifyHandlers_'](listeners, context, id, mockFn);
      assert(listeners.get(context)).to.be(map);
      assert(listeners.get(context).get(id) as Set<any>).to.haveElements([newHandler]);
      assert(mockFn).to.haveBeenCalledWith(handlers);
    });

    it(`should call the function and add a new set if there are no corresponding node ID`, () => {
      const id = instanceId('test', NumberType);
      const context = Mocks.object('context');
      const map = new Map();
      const listeners = new WeakMap();
      listeners.set(context, map);

      const mockFn = jasmine.createSpy('Fn');
      const newHandler = Mocks.object('newHandler');
      mockFn.and.callFake((handlers: Set<any>) => handlers.add(newHandler));

      handler['modifyHandlers_'](listeners, context, id, mockFn);
      assert(listeners.get(context)).to.be(map);
      assert(listeners.get(context).get(id) as Set<any>).to.haveElements([newHandler]);
      assert(mockFn).to.haveBeenCalledWith(Matchers.any(Set));
    });

    it(`should call the function and add a new map if there are no corresponding context`, () => {
      const id = instanceId('test', NumberType);
      const context = Mocks.object('context');
      const listeners = new WeakMap();

      const mockFn = jasmine.createSpy('Fn');
      const newHandler = Mocks.object('newHandler');
      mockFn.and.callFake((handlers: Set<any>) => handlers.add(newHandler));

      handler['modifyHandlers_'](listeners, context, id, mockFn);
      assert(listeners.get(context).get(id) as Set<any>).to.haveElements([newHandler]);
      assert(mockFn).to.haveBeenCalledWith(Matchers.any(Set));
    });

    it(`should call the function and delete the set if empty`, () => {
      const id = instanceId('test', NumberType);
      const otherId = instanceId('other', NumberType);
      const context = Mocks.object('context');
      const existingHandler = Mocks.object('existingHandler');
      const otherHandlers = new Set();
      const handlers = new Set();
      const map = new Map([[id, handlers], [otherId, otherHandlers]]);
      const listeners = new WeakMap();
      listeners.set(context, map);

      const mockFn = jasmine.createSpy('Fn');
      mockFn.and.callFake((handlers: Set<any>) => handlers.delete(existingHandler));

      handler['modifyHandlers_'](listeners, context, id, mockFn);
      assert(listeners.get(context)).to.be(map);
      assert(listeners.get(context).has(id) as boolean).to.beFalse();
      assert(mockFn).to.haveBeenCalledWith(handlers);
    });

    it(`should call the function and delete the map if empty`, () => {
      const id = instanceId('test', NumberType);
      const context = Mocks.object('context');
      const existingHandler = Mocks.object('existingHandler');
      const handlers = new Set();
      const map = new Map([[id, handlers]]);
      const listeners = new WeakMap();
      listeners.set(context, map);

      const mockFn = jasmine.createSpy('Fn');
      mockFn.and.callFake((handlers: Set<any>) => handlers.delete(existingHandler));

      handler['modifyHandlers_'](listeners, context, id, mockFn);
      assert(listeners.has(context) as boolean).to.beFalse();
      assert(mockFn).to.haveBeenCalledWith(handlers);
    });
  });

  describe('onChange', () => {
    it(`should modify the handlers correctly and return the correct deregister function`, () => {
      const id = instanceId('test', NumberType);
      const registeredHandler = Mocks.object('registeredHandler');
      const context = Mocks.object('context');

      const onModifyHandlersSpy = spyOn(handler, 'modifyHandlers_');

      const disposable = handler.onChange(id, registeredHandler, context);
      assert(handler['modifyHandlers_']).to.haveBeenCalledWith(
          handler['onChangeListeners_'],
          context,
          id,
          Matchers.anyFunction());

      const handlers = new Set();
      onModifyHandlersSpy.calls.argsFor(0)[3](handlers);
      assert(handlers).to.haveElements([registeredHandler]);

      onModifyHandlersSpy.calls.reset();
      disposable.dispose();
      assert(handler['modifyHandlers_']).to.haveBeenCalledWith(
          handler['onChangeListeners_'],
          context,
          id,
          Matchers.anyFunction());

      onModifyHandlersSpy.calls.argsFor(0)[3](handlers);
      assert(handlers).to.haveElements([]);
    });
  });

  describe('onReady', () => {
    it(`should modify the handlers correctly and return the correct deregister function`, () => {
      const id = instanceId('test', NumberType);
      const registeredHandler = Mocks.object('registeredHandler');
      const context = Mocks.object('context');

      const onModifyHandlersSpy = spyOn(handler, 'modifyHandlers_');

      const disposable = handler.onReady(id, registeredHandler, context);
      assert(handler['modifyHandlers_']).to.haveBeenCalledWith(
          handler['onReadyListeners_'],
          context,
          id,
          Matchers.anyFunction());

      const handlers = new Set();
      onModifyHandlersSpy.calls.argsFor(0)[3](handlers);
      assert(handlers).to.haveElements([registeredHandler]);

      onModifyHandlersSpy.calls.reset();
      disposable.dispose();
      assert(handler['modifyHandlers_']).to.haveBeenCalledWith(
          handler['onReadyListeners_'],
          context,
          id,
          Matchers.anyFunction());

      onModifyHandlersSpy.calls.argsFor(0)[3](handlers);
      assert(handlers).to.haveElements([]);
    });
  });
});

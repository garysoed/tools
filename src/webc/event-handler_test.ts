import { assert, Matchers, TestBase } from '../test-base';
TestBase.setup();

import { ListenableDom } from '../event/listenable-dom';
import { MonadUtil } from '../event/monad-util';
import { ImmutableSet } from '../immutable/immutable-set';
import { Mocks } from '../mock/mocks';
import { TestDispose } from '../testing/test-dispose';
import { EVENT_ANNOTATIONS, EventHandler } from '../webc/event-handler';


describe('web.EventHandler', () => {
  let handler: EventHandler;

  beforeEach(() => {
    handler = new EventHandler();
  });

  describe('configure', () => {
    it('should listen to the events correctly', () => {
      const targetEl = Mocks.object('targetEl');
      const mockListenableDom = Mocks.listenable('targetEl');
      TestDispose.add(mockListenableDom);

      spyOn(mockListenableDom, 'on').and.callThrough();
      spyOn(ListenableDom, 'of').and.returnValue(mockListenableDom);

      const event1 = 'event1';
      const key1 = 'key1';
      const config1 = Mocks.object('config1');
      const boundArgs1 = 'args1';
      config1['event'] = event1;
      config1['handlerKey'] = key1;
      config1['boundArgs'] = [boundArgs1];

      const event2 = 'event2';
      const key2 = 'key2';
      const config2 = Mocks.object('config2');
      const boundArgs2 = 'args2';
      config2['event'] = event2;
      config2['handlerKey'] = key2;
      config2['boundArgs'] = [boundArgs2];

      const mockInstance = Mocks.disposable('instance');
      TestDispose.add(mockInstance);

      spyOn(MonadUtil, 'callFunction');

      handler.configure(targetEl, mockInstance, ImmutableSet.of<any>([config1, config2]));

      assert(mockListenableDom.on).to
          .haveBeenCalledWith(event1, Matchers.any(Function), mockInstance);
      assert(mockListenableDom.on)
          .to.haveBeenCalledWith(event2, Matchers.any(Function), mockInstance);

      mockListenableDom.on.calls.argsFor(0)[1]();
      assert(MonadUtil.callFunction).to.haveBeenCalledWith({type: event1}, mockInstance, key1);

      mockListenableDom.on.calls.argsFor(1)[1]();
      assert(MonadUtil.callFunction).to.haveBeenCalledWith({type: event2}, mockInstance, key2);
    });
  });

  describe('createDecorator', () => {
    it('should add the value to the annotations correctly', () => {
      const event = 'event';
      const selector = 'selector';
      const ctor = Mocks.object('proto');
      const target = Mocks.object('target');
      target.constructor = ctor;
      const propertyKey = 'propertyKey';
      const descriptor = Mocks.object('descriptor');

      const mockAnnotationsHandler =
          jasmine.createSpyObj('AnnotationsHandler', ['attachValueToProperty']);
      spyOn(EVENT_ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotationsHandler);

      const boundArgs = Mocks.object('boundArgs');
      const decorator = handler.createDecorator(event, selector, boundArgs);
      assert(decorator(target, propertyKey, descriptor)).to.equal(descriptor);
      assert(EVENT_ANNOTATIONS.forCtor).to.haveBeenCalledWith(ctor);
      assert(mockAnnotationsHandler.attachValueToProperty).to.haveBeenCalledWith(
          propertyKey,
          {
            boundArgs,
            event: event,
            handlerKey: propertyKey,
            selector: selector,
          });
    });
  });

  describe('getConfigs', () => {
    it('should return the correct configurations', () => {
      const constructor = Mocks.object('constructor');
      const instance = Mocks.object('instance');
      instance.constructor = constructor;

      const attachedValues = Mocks.object('attachedValues');

      const mockEventHandler =
          jasmine.createSpyObj('EventHandler', ['getAttachedValues']);
      mockEventHandler.getAttachedValues.and.returnValue(attachedValues);
      spyOn(EVENT_ANNOTATIONS, 'forCtor').and.returnValue(mockEventHandler);

      assert(handler.getConfigs(instance)).to.equal(attachedValues);
      assert(EVENT_ANNOTATIONS.forCtor).to.haveBeenCalledWith(constructor);
    });
  });
});

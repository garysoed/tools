import { assert, Matchers, TestBase } from '../test-base';
TestBase.setup();

import { ListenableDom } from '../event/listenable-dom';
import { Mocks } from '../mock/mocks';
import { TestDispose } from '../testing/test-dispose';

import { EVENT_ANNOTATIONS, EventHandler } from './event-handler';


describe('web.EventHandler', () => {
  let handler: EventHandler;

  beforeEach(() => {
    handler = new EventHandler();
  });

  describe('configure', () => {
    it('should listen to the events correctly', () => {
      let targetEl = Mocks.object('targetEl');
      let mockListenableDom = Mocks.listenable('targetEl');
      TestDispose.add(mockListenableDom);

      spyOn(mockListenableDom, 'on').and.callThrough();
      spyOn(ListenableDom, 'of').and.returnValue(mockListenableDom);

      let event1 = 'event1';
      let key1 = 'key1';
      let handler1 = jasmine.createSpy('handler1');
      let config1 = Mocks.object('config1');
      let boundArgs1 = Mocks.object('boundArgs1');
      config1['event'] = event1;
      config1['handlerKey'] = key1;
      config1['boundArgs'] = boundArgs1;

      let event2 = 'event2';
      let key2 = 'key2';
      let handler2 = jasmine.createSpy('handler2');
      let config2 = Mocks.object('config2');
      let boundArgs2 = Mocks.object('boundArgs2');
      config2['event'] = event2;
      config2['handlerKey'] = key2;
      config2['boundArgs'] = boundArgs2;

      let mockInstance = Mocks.disposable('instance');
      mockInstance[key1] = handler1;
      mockInstance[key2] = handler2;
      TestDispose.add(mockInstance);

      handler.configure(targetEl, mockInstance, [config1, config2]);

      assert(mockListenableDom.on).to
          .haveBeenCalledWith(event1, Matchers.any(Function), mockInstance);
      assert(mockListenableDom.on)
          .to.haveBeenCalledWith(event2, Matchers.any(Function), mockInstance);

      mockListenableDom.on.calls.argsFor(0)[1]();
      assert(handler1).to.haveBeenCalledWith(boundArgs1);

      mockListenableDom.on.calls.argsFor(1)[1]();
      assert(handler2).to.haveBeenCalledWith(boundArgs2);
    });
  });

  describe('createDecorator', () => {
    it('should add the value to the annotations correctly', () => {
      let event = 'event';
      let selector = 'selector';
      let ctor = Mocks.object('proto');
      let target = Mocks.object('target');
      target.constructor = ctor;
      let propertyKey = 'propertyKey';
      let descriptor = Mocks.object('descriptor');

      let mockAnnotationsHandler =
          jasmine.createSpyObj('AnnotationsHandler', ['attachValueToProperty']);
      spyOn(EVENT_ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotationsHandler);

      let boundArgs = Mocks.object('boundArgs');
      let decorator = handler.createDecorator(event, selector, boundArgs);
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
      let constructor = Mocks.object('constructor');
      let instance = Mocks.object('instance');
      instance.constructor = constructor;

      let attachedValues = Mocks.object('attachedValues');

      let mockEventHandler =
          jasmine.createSpyObj('EventHandler', ['getAttachedValues']);
      mockEventHandler.getAttachedValues.and.returnValue(attachedValues);
      spyOn(EVENT_ANNOTATIONS, 'forCtor').and.returnValue(mockEventHandler);

      assert(handler.getConfigs(instance)).to.equal(attachedValues);
      assert(EVENT_ANNOTATIONS.forCtor).to.haveBeenCalledWith(constructor);
    });
  });
});

import {assert, TestBase} from '../test-base';
TestBase.setup();

import {EVENT_ANNOTATIONS, EventHandler} from './event-handler';
import {ListenableDom} from '../event/listenable-dom';
import {Mocks} from '../mock/mocks';
import {TestDispose} from '../testing/test-dispose';


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
      config1['event'] = event1;
      config1['handlerKey'] = key1;

      let event2 = 'event2';
      let key2 = 'key2';
      let handler2 = jasmine.createSpy('handler2');
      let config2 = Mocks.object('config2');
      config2['event'] = event2;
      config2['handlerKey'] = key2;

      let mockInstance = Mocks.disposable('instance');
      mockInstance[key1] = handler1;
      mockInstance[key2] = handler2;
      TestDispose.add(mockInstance);

      handler.configure(targetEl, mockInstance, [config1, config2]);

      assert(mockListenableDom.on).to.haveBeenCalledWith(event1, mockInstance[key1], mockInstance);
      assert(mockListenableDom.on).to.haveBeenCalledWith(event2, mockInstance[key2], mockInstance);
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

      let decorator = handler.createDecorator(event, selector);
      assert(decorator(target, propertyKey, descriptor)).to.equal(descriptor);
      assert(EVENT_ANNOTATIONS.forCtor).to.haveBeenCalledWith(ctor);
      assert(mockAnnotationsHandler.attachValueToProperty).to.haveBeenCalledWith(
          propertyKey,
          {
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

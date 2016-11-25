import {assert, Matchers, TestBase} from '../test-base';
TestBase.setup();

import {
  ATTR_CHANGE_ANNOTATIONS,
  AttributeChangeHandlerConfig,
  EVENT_ANNOTATIONS,
  Handler} from './handle';
import {DisposableFunction} from '../dispose/disposable-function';
import {ListenableDom} from '../event/listenable-dom';
import {Mocks} from '../mock/mocks';
import {TestDispose} from '../testing/test-dispose';


describe('webc.Handler', () => {
  let handler: Handler;

  beforeEach(() => {
    handler = new Handler(true /* useShadow */);
  });

  describe('configureAttrChangeHandler_', () => {
    it('should start the mutation observer correctly and call the initial mutation', () => {
      let proto = Mocks.object('proto');
      let mockInstance = jasmine.createSpyObj('Instance', ['addDisposable']);
      mockInstance.constructor = {prototype: proto};
      let element = Mocks.object('element');

      let attributeName1 = 'attributeName1';
      let config1 = Mocks.object('config1');
      config1.attributeName = attributeName1;

      let attributeName2 = 'attributeName2';
      let config2 = Mocks.object('config2');
      config2.attributeName = attributeName2;

      let configMap: Map<string, AttributeChangeHandlerConfig> = new Map();
      configMap.set('propertyKey1', config1);
      configMap.set('propertyKey2', config2);

      spyOn(Handler, 'onMutation_');

      let mockObserver = jasmine.createSpyObj('Observer', ['disconnect', 'observe']);
      spyOn(Handler, 'createMutationObserver_').and.returnValue(mockObserver);

      let disposableFunction = Mocks.object('disposableFunction');
      spyOn(DisposableFunction, 'of').and.returnValue(disposableFunction);

      let targetEl = Mocks.object('targetEl');
      Handler['configureAttrChangeHandler_'](mockInstance, [config1, config2], targetEl);

      assert(mockInstance.addDisposable).to.haveBeenCalledWith(disposableFunction);
      assert(DisposableFunction.of).to.haveBeenCalledWith(<any> Matchers.any(Function));

      (<any> DisposableFunction.of).calls.argsFor(0)[0]();
      assert(mockObserver.disconnect).to.haveBeenCalledWith();

      assert(Handler['onMutation_']).to.haveBeenCalledWith(
          mockInstance,
          Matchers.any(Map),
          [{
            addedNodes: <NodeList> <any> {length: 0},
            attributeName: attributeName1,
            attributeNamespace: null,
            nextSibling: null,
            oldValue: null,
            previousSibling: null,
            removedNodes: <NodeList> <any> {length: 0},
            target: element,
            type: 'attributes',
          }]);
      assert(Handler['onMutation_']).to.haveBeenCalledWith(
          mockInstance,
          Matchers.any(Map),
          [{
            addedNodes: <NodeList> <any> {length: 0},
            attributeName: attributeName2,
            attributeNamespace: null,
            nextSibling: null,
            oldValue: null,
            previousSibling: null,
            removedNodes: <NodeList> <any> {length: 0},
            target: element,
            type: 'attributes',
          }]);

      let map: Map<string, AttributeChangeHandlerConfig[]> =
          (<any> Handler['onMutation_']).calls.argsFor(0)[1];
      assert(map).to.haveEntries([
        [attributeName1, [config1]],
        [attributeName2, [config2]],
      ]);
      assert((<any> Handler['onMutation_']).calls.argsFor(1)[1]).to.be(map);

      assert(mockObserver.observe).to.haveBeenCalledWith(targetEl, {attributes: true});

      assert(Handler['createMutationObserver_']).to
          .haveBeenCalledWith(<any> Matchers.any(Function));

      let mutationRecords = Mocks.object('mutationRecords');
      (<any> Handler['onMutation_']).calls.reset();
      (<any> Handler['createMutationObserver_']).calls.argsFor(0)[0](mutationRecords);
      assert(Handler['onMutation_']).to.haveBeenCalledWith(mockInstance, map, mutationRecords);
    });
  });

  describe('configureEventHandler_', () => {
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

      Handler['configureEventHandler_'](mockInstance, [config1, config2], targetEl);

      assert(mockListenableDom.on).to.haveBeenCalledWith(event1, jasmine.any(Function));
      mockListenableDom.on.calls.argsFor(0)[1]();
      assert(mockInstance[key1]).to.haveBeenCalledWith();

      assert(mockListenableDom.on).to.haveBeenCalledWith(event2, jasmine.any(Function));
      mockListenableDom.on.calls.argsFor(1)[1]();
      assert(mockInstance[key2]).to.haveBeenCalledWith();
    });
  });

  describe('getTargetEl_', () => {
    it('should return the correct element when using shadow root and selector', () => {
      let query = 'query';
      let targetEl = Mocks.object('targetEl');
      let mockShadowRoot = jasmine.createSpyObj('ShadowRoot', ['querySelector']);
      mockShadowRoot.querySelector.and.returnValue(targetEl);

      let element = Mocks.object('element');
      element.shadowRoot = mockShadowRoot;

      let config: any = {query: query, useShadow: true};
      assert(Handler['getTargetEl_'](config, element)).to.equal(targetEl);
      assert(mockShadowRoot.querySelector).to.haveBeenCalledWith(query);
    });

    it('should return the correct element when not using shadow root but using selector', () => {
      let query = 'query';
      let targetEl = Mocks.object('targetEl');

      let mockElement = jasmine.createSpyObj('Element', ['querySelector']);
      mockElement.querySelector.and.returnValue(targetEl);

      let config: any = {query: query, useShadow: false};
      assert(Handler['getTargetEl_'](config, mockElement)).to.equal(targetEl);
      assert(mockElement.querySelector).to.haveBeenCalledWith(query);
    });

    it('should return the correct element when using shadow root but not selector', () => {
      let shadowRoot = Mocks.object('shadowRoot');

      let element = Mocks.object('element');
      element.shadowRoot = shadowRoot;

      let config: any = {query: null, useShadow: true};
      assert(Handler['getTargetEl_'](config, element)).to.equal(shadowRoot);
    });

    it('should return the correct element when not using shadow root or selector', () => {
      let element = Mocks.object('element');
      let config: any = {query: null, useShadow: false};
      assert(Handler['getTargetEl_'](config, element)).to.equal(element);
    });
  });

  describe('onMutation_', () => {
    it('should call the handler correctly', () => {
      let newValue1 = 'newValue1';
      let newValue2 = 'newValue2';
      let oldValue1 = 'oldValue1';
      let oldValue2 = 'oldValue2';
      let parsedNewValue1 = 'parsedNewValue1';
      let parsedOldValue1 = 'parsedOldValue1';
      let parsedNewValue2 = 'parsedNewValue2';
      let parsedOldValue2 = 'parsedOldValue2';

      let mockParser = jasmine.createSpyObj('Parser', ['parse']);
      mockParser.parse.and.callFake((value: any) => {
        switch (value) {
          case newValue1:
            return parsedNewValue1;
          case newValue2:
            return parsedNewValue2;
          case oldValue1:
            return parsedOldValue1;
          case oldValue2:
            return parsedOldValue2;
        }
      });

      let handlerKey1 = 'handlerKey1';
      let handlerKey2 = 'handlerKey2';

      let mockHandler1 = jasmine.createSpy('Handler1');
      let mockHandler2 = jasmine.createSpy('Handler2');
      let instance = Mocks.object('instance');
      instance[handlerKey1] = mockHandler1;
      instance[handlerKey2] = mockHandler2;

      let attributeName1 = 'attributeName1';
      let attributeName2 = 'attributeName2';
      let configs = new Map();
      configs.set(attributeName1, [{handlerKey: handlerKey1, parser: mockParser}]);
      configs.set(attributeName2, [{handlerKey: handlerKey2, parser: mockParser}]);

      let mockTargetEl1 = jasmine.createSpyObj('TargetEl1', ['getAttribute']);
      mockTargetEl1.getAttribute.and.returnValue(newValue1);
      Object.setPrototypeOf(mockTargetEl1, Element.prototype);
      let mockTargetEl2 = jasmine.createSpyObj('TargetEl2', ['getAttribute']);
      mockTargetEl2.getAttribute.and.returnValue(newValue2);
      Object.setPrototypeOf(mockTargetEl2, Element.prototype);

      let records: any[] = [
        {
          attributeName: attributeName1,
          oldValue: oldValue1,
          target: mockTargetEl1,
        },
        {
          attributeName: attributeName2,
          oldValue: oldValue2,
          target: mockTargetEl2,
        },
      ];

      Handler['onMutation_'](instance, configs, records);

      assert(mockHandler1).to.haveBeenCalledWith(parsedNewValue1, parsedOldValue1);
      assert(mockHandler2).to.haveBeenCalledWith(parsedNewValue2, parsedOldValue2);
      assert(mockParser.parse).to.haveBeenCalledWith(newValue1);
      assert(mockParser.parse).to.haveBeenCalledWith(newValue2);
      assert(mockParser.parse).to.haveBeenCalledWith(oldValue1);
      assert(mockParser.parse).to.haveBeenCalledWith(oldValue2);
      assert(mockTargetEl1.getAttribute).to.haveBeenCalledWith(attributeName1);
      assert(mockTargetEl2.getAttribute).to.haveBeenCalledWith(attributeName2);
    });

    it('should not call the handler if the target node is not Element', () => {
      let handlerKey = 'handlerKey';
      let mockHandler = jasmine.createSpy('Handler');
      let instance = Mocks.object('instance');
      instance[handlerKey] = mockHandler;

      let attributeName = 'attributeName';
      let configs = new Map();
      configs.set(attributeName, [{handlerKey: handlerKey, parser: Mocks.object('parser')}]);

      let mockTargetEl = jasmine.createSpyObj('TargetEl', ['getAttribute']);
      mockTargetEl.getAttribute.and.returnValue('newValue');

      let records: any[] = [
        {
          attributeName: attributeName,
          oldValue: 'oldValue',
          target: mockTargetEl,
        },
      ];

      Handler['onMutation_'](instance, configs, records);

      assert(mockHandler).toNot.haveBeenCalled();
    });

    it('should not throw error if the handler does not exist', () => {
      let mockHandler = jasmine.createSpy('Handler');
      let instance = Mocks.object('instance');
      instance['otherHandlerKey'] = mockHandler;

      let attributeName = 'attributeName';
      let configs = new Map();
      configs.set(attributeName, [{handlerKey: 'handlerKey', parser: Mocks.object('parser')}]);

      let mockTargetEl = jasmine.createSpyObj('TargetEl', ['getAttribute']);
      mockTargetEl.getAttribute.and.returnValue('newValue');

      let records: any[] = [
        {
          attributeName: attributeName,
          oldValue: 'oldValue',
          target: mockTargetEl,
        },
      ];

      assert(() => {
        Handler['onMutation_'](instance, configs, records);
      }).toNot.throw();
      assert(mockHandler).toNot.haveBeenCalled();
    });

    it('should not throw error if the attribute name is not listened to', () => {
      let mockHandler = jasmine.createSpy('Handler');
      let instance = Mocks.object('instance');
      instance['handlerKey'] = mockHandler;

      let configs = new Map();
      configs.set(
          'otherAttributeName',
          [{handlerKey: 'handlerKey', parser: Mocks.object('parser')}]);

      let mockTargetEl = jasmine.createSpyObj('TargetEl', ['getAttribute']);
      mockTargetEl.getAttribute.and.returnValue('newValue');

      let records: any[] = [
        {
          attributeName: 'attributeName',
          oldValue: 'oldValue',
          target: mockTargetEl,
        },
      ];

      assert(() => {
        Handler['onMutation_'](instance, configs, records);
      }).toNot.throw();
      assert(mockHandler).toNot.haveBeenCalled();
    });

    it('should not throw error if the record has no attribute names', () => {
      let mockHandler = jasmine.createSpy('Handler');
      let instance = Mocks.object('instance');
      instance['handlerKey'] = mockHandler;

      let configs = new Map();
      configs.set(
          'attributeName',
          [{handlerKey: 'handlerKey', parser: Mocks.object('parser')}]);

      let mockTargetEl = jasmine.createSpyObj('TargetEl', ['getAttribute']);
      mockTargetEl.getAttribute.and.returnValue('newValue');

      let records: any[] = [
        {
          attributeName: null,
          oldValue: 'oldValue',
          target: mockTargetEl,
        },
      ];

      assert(() => {
        Handler['onMutation_'](instance, configs, records);
      }).toNot.throw();
      assert(mockHandler).toNot.haveBeenCalled();
    });
  });

  describe('attributeChange', () => {
    it('should add the value to annotations correctly', () => {
      let selector = 'selector';
      let attributeName = 'attributeName';
      let parser = Mocks.object('parser');
      let ctor = Mocks.object('proto');
      let target = Mocks.object('target');
      target.constructor = ctor;
      let propertyKey = 'propertyKey';
      let descriptor = Mocks.object('descriptor');

      let mockAnnotationsHandler =
          jasmine.createSpyObj('AnnotationsHandler', ['attachValueToProperty']);
      spyOn(ATTR_CHANGE_ANNOTATIONS, 'forPrototype').and.returnValue(mockAnnotationsHandler);

      let decorator = handler.attributeChange(selector, attributeName, parser);
      assert(decorator(target, propertyKey, descriptor)).to.equal(descriptor);
      assert(ATTR_CHANGE_ANNOTATIONS.forPrototype).to.haveBeenCalledWith(ctor);
      assert(mockAnnotationsHandler.attachValueToProperty).to.haveBeenCalledWith(
          propertyKey,
          {
            attributeName: attributeName,
            handlerKey: propertyKey,
            parser: parser,
            selector: {
              query: selector,
              useShadow: true,
            },
          });
    });
  });

  describe('event', () => {
    it('should add the value to the annotations correctly', () => {
      let selector = 'selector';
      let event = 'event';
      let ctor = Mocks.object('proto');
      let target = Mocks.object('target');
      target.constructor = ctor;
      let propertyKey = 'propertyKey';
      let descriptor = Mocks.object('descriptor');

      let mockAnnotationsHandler =
          jasmine.createSpyObj('AnnotationsHandler', ['attachValueToProperty']);
      spyOn(EVENT_ANNOTATIONS, 'forPrototype').and.returnValue(mockAnnotationsHandler);

      let decorator = handler.event(selector, event);
      assert(decorator(target, propertyKey, descriptor)).to.equal(descriptor);
      assert(EVENT_ANNOTATIONS.forPrototype).to.haveBeenCalledWith(ctor);
      assert(mockAnnotationsHandler.attachValueToProperty).to.haveBeenCalledWith(
          propertyKey,
          {
            event: event,
            handlerKey: propertyKey,
            selector: {
              query: selector,
              useShadow: true,
            },
          });
    });
  });

  describe('configure', () => {
    it('should start the mutation observer correctly and call the initial mutation', () => {
      let element = Mocks.object('element');
      let ctor = Mocks.object('ctor');
      let instance = Mocks.object('instance');
      instance.constructor = ctor;

      let configs1_1 = Mocks.object('configs1_1');
      let selector1_1 = Mocks.object('selector1_1');
      configs1_1.selector = selector1_1;

      let configs1_2 = Mocks.object('configs1_2');
      let selector1_2 = Mocks.object('selector1_2');
      configs1_2.selector = selector1_2;

      let configs2_1 = Mocks.object('configs2_1');
      let selector2_1 = Mocks.object('selector2_1');
      configs2_1.selector = selector2_1;

      let configs2_2 = Mocks.object('configs2_2');
      let selector2_2 = Mocks.object('selector2_2');
      configs2_2.selector = selector2_2;

      let map = new Map();
      map.set('propertyKey1_1', configs1_1);
      map.set('propertyKey1_2', configs1_2);
      map.set('propertyKey2_1', configs2_1);
      map.set('propertyKey2_2', configs2_2);

      let mockAnnotationsHandle = jasmine.createSpyObj('AnnotationsHandle', ['getAttachedValues']);
      mockAnnotationsHandle.getAttachedValues.and.returnValue(map);
      spyOn(ATTR_CHANGE_ANNOTATIONS, 'forPrototype').and.returnValue(mockAnnotationsHandle);

      let targetEl1 = Mocks.object('targetEl1');
      let targetEl2 = Mocks.object('targetEl2');
      spyOn(Handler, 'getTargetEl_').and.callFake((config: any) => {
        switch (config) {
          case selector1_1:
          case selector1_2:
            return targetEl1;
          case selector2_1:
          case selector2_2:
            return targetEl2;
        }
      });
      spyOn(Handler, 'configureAttrChangeHandler_');

      Handler.configure(element, instance);

      assert(Handler['configureAttrChangeHandler_']).to
          .haveBeenCalledWith(instance, [configs1_1, configs1_2], targetEl1);
      assert(Handler['configureAttrChangeHandler_']).to
          .haveBeenCalledWith(instance, [configs2_1, configs2_2], targetEl2);
      assert(Handler['getTargetEl_']).to.haveBeenCalledWith(selector1_1, element);
      assert(Handler['getTargetEl_']).to.haveBeenCalledWith(selector1_2, element);
      assert(Handler['getTargetEl_']).to.haveBeenCalledWith(selector2_1, element);
      assert(Handler['getTargetEl_']).to.haveBeenCalledWith(selector2_2, element);

      assert(ATTR_CHANGE_ANNOTATIONS.forPrototype).to.haveBeenCalledWith(ctor);
    });

    it('should configure event handlers', () => {
      let element = Mocks.object('element');
      let ctor = Mocks.object('ctor');
      let instance = Mocks.object('instance');
      instance.constructor = ctor;

      let configs1_1 = Mocks.object('configs1_1');
      let selector1_1 = Mocks.object('selector1_1');
      configs1_1.selector = selector1_1;

      let configs1_2 = Mocks.object('configs1_2');
      let selector1_2 = Mocks.object('selector1_2');
      configs1_2.selector = selector1_2;

      let configs2_1 = Mocks.object('configs2_1');
      let selector2_1 = Mocks.object('selector2_1');
      configs2_1.selector = selector2_1;

      let configs2_2 = Mocks.object('configs2_2');
      let selector2_2 = Mocks.object('selector2_2');
      configs2_2.selector = selector2_2;

      let map = new Map();
      map.set('propertyKey1_1', configs1_1);
      map.set('propertyKey1_2', configs1_2);
      map.set('propertyKey2_1', configs2_1);
      map.set('propertyKey2_2', configs2_2);

      let mockAnnotationsHandle = jasmine.createSpyObj('AnnotationsHandle', ['getAttachedValues']);
      mockAnnotationsHandle.getAttachedValues.and.returnValue(map);
      spyOn(EVENT_ANNOTATIONS, 'forPrototype').and.returnValue(mockAnnotationsHandle);

      let targetEl1 = Mocks.object('targetEl1');
      let targetEl2 = Mocks.object('targetEl2');
      spyOn(Handler, 'getTargetEl_').and.callFake((config: any) => {
        switch (config) {
          case selector1_1:
          case selector1_2:
            return targetEl1;
          case selector2_1:
          case selector2_2:
            return targetEl2;
        }
      });
      spyOn(Handler, 'configureEventHandler_');

      Handler.configure(element, instance);

      assert(Handler['configureEventHandler_']).to
          .haveBeenCalledWith(instance, [configs1_1, configs1_2], targetEl1);
      assert(Handler['configureEventHandler_']).to
          .haveBeenCalledWith(instance, [configs2_1, configs2_2], targetEl2);
      assert(Handler['getTargetEl_']).to.haveBeenCalledWith(selector1_1, element);
      assert(Handler['getTargetEl_']).to.haveBeenCalledWith(selector1_2, element);
      assert(Handler['getTargetEl_']).to.haveBeenCalledWith(selector2_1, element);
      assert(Handler['getTargetEl_']).to.haveBeenCalledWith(selector2_2, element);

      assert(EVENT_ANNOTATIONS.forPrototype).to.haveBeenCalledWith(ctor);
    });
  });
});

import {assert, Matchers, TestBase} from '../test-base';
TestBase.setup();

import {DisposableFunction} from '../dispose/disposable-function';
import {Mocks} from '../mock/mocks';

import {
  ATTR_CHANGE_ANNOTATIONS,
  AttributeChangeHandler,
  AttributeChangeHandlerConfig as Config} from './attribute-change-handler';


describe('webc.AttributeChangeHandler', () => {
  let handler: AttributeChangeHandler;

  beforeEach(() => {
    handler = new AttributeChangeHandler();
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

      handler['onMutation_'](instance, configs, records);

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

      handler['onMutation_'](instance, configs, records);

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
        handler['onMutation_'](instance, configs, records);
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
        handler['onMutation_'](instance, configs, records);
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
        handler['onMutation_'](instance, configs, records);
      }).toNot.throw();
      assert(mockHandler).toNot.haveBeenCalled();
    });
  });

  describe('configure', () => {
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

      let configMap: Map<string, Config> = new Map();
      configMap.set('propertyKey1', config1);
      configMap.set('propertyKey2', config2);

      spyOn(handler, 'onMutation_');

      let mockObserver = jasmine.createSpyObj('Observer', ['disconnect', 'observe']);
      spyOn(handler, 'createMutationObserver_').and.returnValue(mockObserver);

      let disposableFunction = Mocks.object('disposableFunction');
      spyOn(DisposableFunction, 'of').and.returnValue(disposableFunction);

      let targetEl = Mocks.object('targetEl');
      handler.configure(targetEl, mockInstance, [config1, config2]);

      assert(mockInstance.addDisposable).to.haveBeenCalledWith(disposableFunction);
      assert(DisposableFunction.of).to.haveBeenCalledWith(<any> Matchers.any(Function));

      (<any> DisposableFunction.of).calls.argsFor(0)[0]();
      assert(mockObserver.disconnect).to.haveBeenCalledWith();

      assert(handler['onMutation_']).to.haveBeenCalledWith(
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
      assert(handler['onMutation_']).to.haveBeenCalledWith(
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

      let map: Map<string, Config[]> =
          (<any> handler['onMutation_']).calls.argsFor(0)[1];
      assert(map).to.haveEntries([
        [attributeName1, [config1]],
        [attributeName2, [config2]],
      ]);
      assert((<any> handler['onMutation_']).calls.argsFor(1)[1]).to.be(map);

      assert(mockObserver.observe).to
          .haveBeenCalledWith(
              targetEl,
              {
                attributeFilter: [attributeName1, attributeName2],
                attributeOldValue: true,
                attributes: true,
              });

      assert(handler['createMutationObserver_']).to.haveBeenCalledWith(mockInstance, map);
    });
  });

  describe('createDecorator', () => {
    it('should add the value to annotations correctly', () => {
      let attributeName = 'attributeName';
      let parser = Mocks.object('parser');
      let selector = 'selector';
      let ctor = Mocks.object('proto');
      let target = Mocks.object('target');
      target.constructor = ctor;
      let propertyKey = 'propertyKey';
      let descriptor = Mocks.object('descriptor');

      let mockAnnotationsHandler =
          jasmine.createSpyObj('AnnotationsHandler', ['attachValueToProperty']);
      spyOn(ATTR_CHANGE_ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotationsHandler);

      let decorator = handler.createDecorator(attributeName, parser, selector);
      assert(decorator(target, propertyKey, descriptor)).to.equal(descriptor);
      assert(ATTR_CHANGE_ANNOTATIONS.forCtor).to.haveBeenCalledWith(ctor);
      assert(mockAnnotationsHandler.attachValueToProperty).to.haveBeenCalledWith(
          propertyKey,
          {
            attributeName: attributeName,
            handlerKey: propertyKey,
            parser: parser,
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

      let mockAnnotationsHandler =
          jasmine.createSpyObj('AnnotationsHandler', ['getAttachedValues']);
      mockAnnotationsHandler.getAttachedValues.and.returnValue(attachedValues);
      spyOn(ATTR_CHANGE_ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotationsHandler);

      assert(handler.getConfigs(instance)).to.equal(attachedValues);
      assert(ATTR_CHANGE_ANNOTATIONS.forCtor).to.haveBeenCalledWith(constructor);
    });
  });
});

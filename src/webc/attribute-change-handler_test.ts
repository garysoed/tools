import { assert, Matchers, TestBase } from '../test-base';
TestBase.setup();

import { DisposableFunction } from '../dispose/disposable-function';
import { Fakes } from '../mock/fakes';
import { Mocks } from '../mock/mocks';

import {
  ATTR_CHANGE_ANNOTATIONS,
  AttributeChangeHandler,
  AttributeChangeHandlerConfig as Config } from './attribute-change-handler';


describe('webc.AttributeChangeHandler', () => {
  let handler: AttributeChangeHandler;

  beforeEach(() => {
    handler = new AttributeChangeHandler();
  });

  describe('onMutation_', () => {
    it('should call the handler correctly', () => {
      const newValue1 = 'newValue1';
      const newValue2 = 'newValue2';
      const oldValue1 = 'oldValue1';
      const oldValue2 = 'oldValue2';
      const parsedNewValue1 = 'parsedNewValue1';
      const parsedOldValue1 = 'parsedOldValue1';
      const parsedNewValue2 = 'parsedNewValue2';
      const parsedOldValue2 = 'parsedOldValue2';

      const mockParser = jasmine.createSpyObj('Parser', ['parse']);

      Fakes.build(mockParser.parse)
          .when(newValue1).return(parsedNewValue1)
          .when(newValue2).return(parsedNewValue2)
          .when(oldValue1).return(parsedOldValue1)
          .when(oldValue2).return(parsedOldValue2);

      const handlerKey1 = 'handlerKey1';
      const handlerKey2 = 'handlerKey2';

      const mockHandler1 = jasmine.createSpy('Handler1');
      const mockHandler2 = jasmine.createSpy('Handler2');
      const instance = Mocks.object('instance');
      instance[handlerKey1] = mockHandler1;
      instance[handlerKey2] = mockHandler2;

      const attributeName1 = 'attributeName1';
      const attributeName2 = 'attributeName2';
      const configs = new Map();
      configs.set(attributeName1, [{handlerKey: handlerKey1, parser: mockParser}]);
      configs.set(attributeName2, [{handlerKey: handlerKey2, parser: mockParser}]);

      const mockTargetEl1 = jasmine.createSpyObj('TargetEl1', ['getAttribute']);
      mockTargetEl1.getAttribute.and.returnValue(newValue1);
      Object.setPrototypeOf(mockTargetEl1, Element.prototype);
      const mockTargetEl2 = jasmine.createSpyObj('TargetEl2', ['getAttribute']);
      mockTargetEl2.getAttribute.and.returnValue(newValue2);
      Object.setPrototypeOf(mockTargetEl2, Element.prototype);

      const records: any[] = [
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

    it('should call the handler without any values if the parser was not given', () => {
      const handlerKey = 'handlerKey';

      const mockHandler = jasmine.createSpy('Handler');
      const instance = Mocks.object('instance');
      instance[handlerKey] = mockHandler;

      const attributeName = 'attributeName';
      const configs = new Map();
      configs.set(attributeName, [{handlerKey: handlerKey, parser: null}]);

      const records: any[] = [{attributeName}];

      handler['onMutation_'](instance, configs, records);

      assert(mockHandler).to.haveBeenCalledWith();
    });

    it('should not call the handler if the target node is not Element', () => {
      const handlerKey = 'handlerKey';
      const mockHandler = jasmine.createSpy('Handler');
      const instance = Mocks.object('instance');
      instance[handlerKey] = mockHandler;

      const attributeName = 'attributeName';
      const configs = new Map();
      configs.set(attributeName, [{handlerKey: handlerKey, parser: Mocks.object('parser')}]);

      const mockTargetEl = jasmine.createSpyObj('TargetEl', ['getAttribute']);
      mockTargetEl.getAttribute.and.returnValue('newValue');

      const records: any[] = [
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
      const mockHandler = jasmine.createSpy('Handler');
      const instance = Mocks.object('instance');
      instance['otherHandlerKey'] = mockHandler;

      const attributeName = 'attributeName';
      const configs = new Map();
      configs.set(attributeName, [{handlerKey: 'handlerKey', parser: Mocks.object('parser')}]);

      const mockTargetEl = jasmine.createSpyObj('TargetEl', ['getAttribute']);
      mockTargetEl.getAttribute.and.returnValue('newValue');

      const records: any[] = [
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
      const mockHandler = jasmine.createSpy('Handler');
      const instance = Mocks.object('instance');
      instance['handlerKey'] = mockHandler;

      const configs = new Map();
      configs.set(
          'otherAttributeName',
          [{handlerKey: 'handlerKey', parser: Mocks.object('parser')}]);

      const mockTargetEl = jasmine.createSpyObj('TargetEl', ['getAttribute']);
      mockTargetEl.getAttribute.and.returnValue('newValue');

      const records: any[] = [
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
      const mockHandler = jasmine.createSpy('Handler');
      const instance = Mocks.object('instance');
      instance['handlerKey'] = mockHandler;

      const configs = new Map();
      configs.set(
          'attributeName',
          [{handlerKey: 'handlerKey', parser: Mocks.object('parser')}]);

      const mockTargetEl = jasmine.createSpyObj('TargetEl', ['getAttribute']);
      mockTargetEl.getAttribute.and.returnValue('newValue');

      const records: any[] = [
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
      const proto = Mocks.object('proto');
      const mockInstance = jasmine.createSpyObj('Instance', ['addDisposable']);
      mockInstance.constructor = {prototype: proto};
      const element = Mocks.object('element');

      const attributeName1 = 'attributeName1';
      const config1 = Mocks.object('config1');
      config1.attributeName = attributeName1;

      const attributeName2 = 'attributeName2';
      const config2 = Mocks.object('config2');
      config2.attributeName = attributeName2;

      const configMap: Map<string, Config> = new Map();
      configMap.set('propertyKey1', config1);
      configMap.set('propertyKey2', config2);

      spyOn(handler, 'onMutation_');

      const mockObserver = jasmine.createSpyObj('Observer', ['disconnect', 'observe']);
      spyOn(handler, 'createMutationObserver_').and.returnValue(mockObserver);

      const disposableFunction = Mocks.object('disposableFunction');
      spyOn(DisposableFunction, 'of').and.returnValue(disposableFunction);

      const targetEl = Mocks.object('targetEl');
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

      const map: Map<string, Config[]> =
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
      const attributeName = 'attributeName';
      const parser = Mocks.object('parser');
      const selector = 'selector';
      const ctor = Mocks.object('proto');
      const target = Mocks.object('target');
      target.constructor = ctor;
      const propertyKey = 'propertyKey';
      const descriptor = Mocks.object('descriptor');

      const mockAnnotationsHandler =
          jasmine.createSpyObj('AnnotationsHandler', ['attachValueToProperty']);
      spyOn(ATTR_CHANGE_ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotationsHandler);

      const decorator = handler.createDecorator(attributeName, parser, selector);
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
      const constructor = Mocks.object('constructor');
      const instance = Mocks.object('instance');
      instance.constructor = constructor;

      const attachedValues = Mocks.object('attachedValues');

      const mockAnnotationsHandler =
          jasmine.createSpyObj('AnnotationsHandler', ['getAttachedValues']);
      mockAnnotationsHandler.getAttachedValues.and.returnValue(attachedValues);
      spyOn(ATTR_CHANGE_ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotationsHandler);

      assert(handler.getConfigs(instance)).to.equal(attachedValues);
      assert(ATTR_CHANGE_ANNOTATIONS.forCtor).to.haveBeenCalledWith(constructor);
    });
  });
});

import { assert, Matchers, TestBase } from '../test-base';
TestBase.setup();

import { DisposableFunction } from '../dispose/disposable-function';
import { Mocks } from '../mock/mocks';

import { MonadUtil } from '../event/monad-util';
import { ImmutableMap } from '../immutable/immutable-map';
import { ImmutableSet } from '../immutable/immutable-set';
import {
  ATTR_CHANGE_ANNOTATIONS,
  AttributeChangeHandler,
  AttributeChangeHandlerConfig as Config} from '../webc/attribute-change-handler';


describe('webc.AttributeChangeHandler', () => {
  let handler: AttributeChangeHandler;

  beforeEach(() => {
    handler = new AttributeChangeHandler();
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
      handler.configure(targetEl, mockInstance, ImmutableSet.of([config1, config2]));

      assert(mockInstance.addDisposable).to.haveBeenCalledWith(disposableFunction);
      assert(DisposableFunction.of).to.haveBeenCalledWith(Matchers.any(Function) as any);

      (DisposableFunction.of as any).calls.argsFor(0)[0]();
      assert(mockObserver.disconnect).to.haveBeenCalledWith();

      assert(handler['onMutation_']).to.haveBeenCalledWith(
          mockInstance,
          Matchers.any(ImmutableMap),
          ImmutableSet.of([{
            addedNodes: {length: 0} as any as NodeList,
            attributeName: attributeName1,
            attributeNamespace: null,
            nextSibling: null,
            oldValue: null,
            previousSibling: null,
            removedNodes: {length: 0} as any as NodeList,
            target: element,
            type: 'attributes',
          }]));
      assert(handler['onMutation_']).to.haveBeenCalledWith(
          mockInstance,
          Matchers.any(ImmutableMap),
          ImmutableSet.of([{
            addedNodes: {length: 0} as NodeList as any,
            attributeName: attributeName2,
            attributeNamespace: null,
            nextSibling: null,
            oldValue: null,
            previousSibling: null,
            removedNodes: {length: 0} as any as NodeList,
            target: element,
            type: 'attributes',
          }]));

      const map: ImmutableMap<string, ImmutableSet<Config>> =
          (handler['onMutation_'] as any).calls.argsFor(0)[1];
      assert(map).to.haveElements([
        [attributeName1, ImmutableSet.of([config1])],
        [attributeName2, ImmutableSet.of([config2])],
      ]);
      assert((handler['onMutation_'] as any).calls.argsFor(1)[1]).to.be(map);

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
            parser,
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

  describe('onMutation_', () => {
    it('should call the handler correctly', () => {
      const handlerKey1 = 'handlerKey1';
      const handlerKey2 = 'handlerKey2';

      const mockHandler1 = jasmine.createSpy('Handler1');
      const mockHandler2 = jasmine.createSpy('Handler2');
      const instance = Mocks.object('instance');
      instance[handlerKey1] = mockHandler1;
      instance[handlerKey2] = mockHandler2;

      const parsedValue1 = Mocks.object('parsedValue1');
      const parsedValue2 = Mocks.object('parsedValue2');
      const mockParser1 = jasmine.createSpyObj('Parser1', ['parse']);
      mockParser1.parse.and.returnValue(parsedValue1);
      const mockParser2 = jasmine.createSpyObj('Parser2', ['parse']);
      mockParser2.parse.and.returnValue(parsedValue2);

      const attributeName1 = 'attributeName1';
      const attributeName2 = 'attributeName2';
      const configs = ImmutableMap.of<string, ImmutableSet<any>>([
        [
          attributeName1,
          ImmutableSet.of([{handlerKey: handlerKey1, parser: mockParser1}]),
        ],
        [
          attributeName2,
          ImmutableSet.of([{handlerKey: handlerKey2, parser: mockParser2}]),
        ],
      ]);

      const oldValue1 = Mocks.object('oldValue1');
      const oldValue2 = Mocks.object('oldValue2');
      const mockTarget1 = jasmine.createSpyObj('Target1', ['getAttribute']);
      Object.setPrototypeOf(mockTarget1, Element.prototype);
      mockTarget1.getAttribute.and.returnValue(Mocks.object('value1'));
      const mockTarget2 = jasmine.createSpyObj('Target2', ['getAttribute']);
      Object.setPrototypeOf(mockTarget2, Element.prototype);
      mockTarget2.getAttribute.and.returnValue(Mocks.object('value2'));
      const records = ImmutableSet.of<any>(
        [
          {
            attributeName: attributeName1,
            oldValue: oldValue1,
            target: mockTarget1,
          },
          {
            attributeName: attributeName2,
            oldValue: oldValue2,
            target: mockTarget2,
          },
        ]);
      spyOn(MonadUtil, 'callFunction');

      handler['onMutation_'](instance, configs, records);
      assert(MonadUtil.callFunction).to.haveBeenCalledWith(
          {type: 'gs-attributechanged', oldValue: parsedValue1}, instance, handlerKey1);
      assert(MonadUtil.callFunction).to.haveBeenCalledWith(
          {type: 'gs-attributechanged', oldValue: parsedValue2}, instance, handlerKey2);
      assert(mockParser1.parse).to.haveBeenCalledWith(oldValue1);
      assert(mockParser2.parse).to.haveBeenCalledWith(oldValue2);
    });

    it(`should skip records with no matching configs`, () => {
      const handlerKey1 = 'handlerKey1';
      const handlerKey2 = 'handlerKey2';

      const mockHandler1 = jasmine.createSpy('Handler1');
      const mockHandler2 = jasmine.createSpy('Handler2');
      const instance = Mocks.object('instance');
      instance[handlerKey1] = mockHandler1;
      instance[handlerKey2] = mockHandler2;

      const parsedValue1 = Mocks.object('parsedValue1');
      const parsedValue2 = Mocks.object('parsedValue2');
      const mockParser1 = jasmine.createSpyObj('Parser1', ['parse']);
      mockParser1.parse.and.returnValue(parsedValue1);
      const mockParser2 = jasmine.createSpyObj('Parser2', ['parse']);
      mockParser2.parse.and.returnValue(parsedValue2);

      const attributeName1 = 'attributeName1';
      const attributeName2 = 'attributeName2';
      const configs = ImmutableMap.of<string, ImmutableSet<any>>([
        [
          attributeName2,
          ImmutableSet.of([{handlerKey: handlerKey2, parser: mockParser2}]),
        ],
      ]);

      const oldValue1 = Mocks.object('oldValue1');
      const oldValue2 = Mocks.object('oldValue2');
      const mockTarget1 = jasmine.createSpyObj('Target1', ['getAttribute']);
      Object.setPrototypeOf(mockTarget1, Element.prototype);
      mockTarget1.getAttribute.and.returnValue(Mocks.object('value1'));
      const mockTarget2 = jasmine.createSpyObj('Target2', ['getAttribute']);
      Object.setPrototypeOf(mockTarget2, Element.prototype);
      mockTarget2.getAttribute.and.returnValue(Mocks.object('value2'));
      const records = ImmutableSet.of<any>(
        [
          {
            attributeName: attributeName1,
            oldValue: oldValue1,
            target: mockTarget1,
          },
          {
            attributeName: attributeName2,
            oldValue: oldValue2,
            target: mockTarget2,
          },
        ]);
      spyOn(MonadUtil, 'callFunction');

      handler['onMutation_'](instance, configs, records);
      assert(MonadUtil.callFunction).toNot.haveBeenCalledWith(
          {type: 'gs-attributechanged', oldValue: parsedValue1}, instance, handlerKey1);
      assert(MonadUtil.callFunction).to.haveBeenCalledWith(
          {type: 'gs-attributechanged', oldValue: parsedValue2}, instance, handlerKey2);
      assert(mockParser1.parse).toNot.haveBeenCalledWith(oldValue1);
      assert(mockParser2.parse).to.haveBeenCalledWith(oldValue2);
    });

    it(`should skip records whose value has not changed`, () => {
      const handlerKey1 = 'handlerKey1';
      const handlerKey2 = 'handlerKey2';

      const mockHandler1 = jasmine.createSpy('Handler1');
      const mockHandler2 = jasmine.createSpy('Handler2');
      const instance = Mocks.object('instance');
      instance[handlerKey1] = mockHandler1;
      instance[handlerKey2] = mockHandler2;

      const parsedValue1 = Mocks.object('parsedValue1');
      const parsedValue2 = Mocks.object('parsedValue2');
      const mockParser1 = jasmine.createSpyObj('Parser1', ['parse']);
      mockParser1.parse.and.returnValue(parsedValue1);
      const mockParser2 = jasmine.createSpyObj('Parser2', ['parse']);
      mockParser2.parse.and.returnValue(parsedValue2);

      const attributeName1 = 'attributeName1';
      const attributeName2 = 'attributeName2';
      const configs = ImmutableMap.of<string, ImmutableSet<any>>([
        [
          attributeName1,
          ImmutableSet.of([{handlerKey: handlerKey1, parser: mockParser1}]),
        ],
        [
          attributeName2,
          ImmutableSet.of([{handlerKey: handlerKey2, parser: mockParser2}]),
        ],
      ]);

      const oldValue1 = Mocks.object('oldValue1');
      const oldValue2 = Mocks.object('oldValue2');
      const mockTarget1 = jasmine.createSpyObj('Target1', ['getAttribute']);
      Object.setPrototypeOf(mockTarget1, Element.prototype);
      mockTarget1.getAttribute.and.returnValue(oldValue1);
      const mockTarget2 = jasmine.createSpyObj('Target2', ['getAttribute']);
      Object.setPrototypeOf(mockTarget2, Element.prototype);
      mockTarget2.getAttribute.and.returnValue(Mocks.object('value2'));
      const records = ImmutableSet.of<any>(
        [
          {
            attributeName: attributeName1,
            oldValue: oldValue1,
            target: mockTarget1,
          },
          {
            attributeName: attributeName2,
            oldValue: oldValue2,
            target: mockTarget2,
          },
        ]);
      spyOn(MonadUtil, 'callFunction');

      handler['onMutation_'](instance, configs, records);
      assert(MonadUtil.callFunction).toNot.haveBeenCalledWith(
          {type: 'gs-attributechanged', oldValue: parsedValue1}, instance, handlerKey1);
      assert(MonadUtil.callFunction).to.haveBeenCalledWith(
          {type: 'gs-attributechanged', oldValue: parsedValue2}, instance, handlerKey2);
      assert(mockParser1.parse).toNot.haveBeenCalledWith(oldValue1);
      assert(mockParser2.parse).to.haveBeenCalledWith(oldValue2);
    });

    it('should skip records with no attribute names', () => {
      const handlerKey1 = 'handlerKey1';
      const handlerKey2 = 'handlerKey2';

      const mockHandler1 = jasmine.createSpy('Handler1');
      const mockHandler2 = jasmine.createSpy('Handler2');
      const instance = Mocks.object('instance');
      instance[handlerKey1] = mockHandler1;
      instance[handlerKey2] = mockHandler2;

      const parsedValue1 = Mocks.object('parsedValue1');
      const parsedValue2 = Mocks.object('parsedValue2');
      const mockParser1 = jasmine.createSpyObj('Parser1', ['parse']);
      mockParser1.parse.and.returnValue(parsedValue1);
      const mockParser2 = jasmine.createSpyObj('Parser2', ['parse']);
      mockParser2.parse.and.returnValue(parsedValue2);

      const attributeName1 = 'attributeName1';
      const attributeName2 = 'attributeName2';
      const configs = ImmutableMap.of<string, ImmutableSet<any>>([
        [
          attributeName1,
          ImmutableSet.of([{handlerKey: handlerKey1, parser: mockParser1}]),
        ],
        [
          attributeName2,
          ImmutableSet.of([{handlerKey: handlerKey2, parser: mockParser2}]),
        ],
      ]);

      const oldValue1 = Mocks.object('oldValue1');
      const oldValue2 = Mocks.object('oldValue2');
      const mockTarget1 = jasmine.createSpyObj('Target1', ['getAttribute']);
      Object.setPrototypeOf(mockTarget1, Element.prototype);
      mockTarget1.getAttribute.and.returnValue(Mocks.object('value1'));
      const mockTarget2 = jasmine.createSpyObj('Target2', ['getAttribute']);
      Object.setPrototypeOf(mockTarget2, Element.prototype);
      mockTarget2.getAttribute.and.returnValue(Mocks.object('value2'));
      const records = ImmutableSet.of<any>(
        [
          {
            oldValue: oldValue1,
            target: mockTarget1,
          },
          {
            attributeName: attributeName2,
            oldValue: oldValue2,
            target: mockTarget2,
          },
        ]);
      spyOn(MonadUtil, 'callFunction');

      handler['onMutation_'](instance, configs, records);
      assert(MonadUtil.callFunction).toNot.haveBeenCalledWith(
          {type: 'gs-attributechanged', oldValue: parsedValue1}, instance, handlerKey1);
      assert(MonadUtil.callFunction).to.haveBeenCalledWith(
          {type: 'gs-attributechanged', oldValue: parsedValue2}, instance, handlerKey2);
      assert(mockParser1.parse).toNot.haveBeenCalledWith(oldValue1);
      assert(mockParser2.parse).to.haveBeenCalledWith(oldValue2);
    });

    it(`should skip records whose target is not an element`, () => {
      const handlerKey1 = 'handlerKey1';
      const handlerKey2 = 'handlerKey2';

      const mockHandler1 = jasmine.createSpy('Handler1');
      const mockHandler2 = jasmine.createSpy('Handler2');
      const instance = Mocks.object('instance');
      instance[handlerKey1] = mockHandler1;
      instance[handlerKey2] = mockHandler2;

      const parsedValue1 = Mocks.object('parsedValue1');
      const parsedValue2 = Mocks.object('parsedValue2');
      const mockParser1 = jasmine.createSpyObj('Parser1', ['parse']);
      mockParser1.parse.and.returnValue(parsedValue1);
      const mockParser2 = jasmine.createSpyObj('Parser2', ['parse']);
      mockParser2.parse.and.returnValue(parsedValue2);

      const attributeName1 = 'attributeName1';
      const attributeName2 = 'attributeName2';
      const configs = ImmutableMap.of<string, ImmutableSet<any>>([
        [
          attributeName1,
          ImmutableSet.of([{handlerKey: handlerKey1, parser: mockParser1}]),
        ],
        [
          attributeName2,
          ImmutableSet.of([{handlerKey: handlerKey2, parser: mockParser2}]),
        ],
      ]);

      const oldValue1 = Mocks.object('oldValue1');
      const oldValue2 = Mocks.object('oldValue2');
      const mockTarget1 = jasmine.createSpyObj('Target1', ['getAttribute']);
      mockTarget1.getAttribute.and.returnValue(Mocks.object('value1'));
      const mockTarget2 = jasmine.createSpyObj('Target2', ['getAttribute']);
      Object.setPrototypeOf(mockTarget2, Element.prototype);
      mockTarget2.getAttribute.and.returnValue(Mocks.object('value2'));
      const records = ImmutableSet.of<any>(
        [
          {
            attributeName: attributeName1,
            oldValue: oldValue1,
            target: mockTarget1,
          },
          {
            attributeName: attributeName2,
            oldValue: oldValue2,
            target: mockTarget2,
          },
        ]);
      spyOn(MonadUtil, 'callFunction');

      handler['onMutation_'](instance, configs, records);
      assert(MonadUtil.callFunction).toNot.haveBeenCalledWith(
          {type: 'gs-attributechanged', oldValue: parsedValue1}, instance, handlerKey1);
      assert(MonadUtil.callFunction).to.haveBeenCalledWith(
          {type: 'gs-attributechanged', oldValue: parsedValue2}, instance, handlerKey2);
      assert(mockParser1.parse).toNot.haveBeenCalledWith(oldValue1);
      assert(mockParser2.parse).to.haveBeenCalledWith(oldValue2);
    });
  });
});

import { assert, Matchers, TestBase } from '../test-base';
TestBase.setup();

import { Fakes } from '../mock/fakes';
import { Mocks } from '../mock/mocks';
import { TestDispose } from '../testing/test-dispose';
import { Log } from '../util/log';
import { BaseElement } from '../webc/base-element';
import { ANNOTATIONS as BindAnnotations } from '../webc/bind';
import { CustomElementUtil } from '../webc/custom-element-util';
import { DomHook } from '../webc/dom-hook';
import { ElementRegistrar } from '../webc/element-registrar';


describe('webc.ElementRegistrar', () => {
  let mockInjector;
  let mockTemplates;
  let mockXtag;
  let registrar;

  beforeEach(() => {
    mockInjector = jasmine.createSpyObj('Injector', ['instantiate']);
    mockTemplates = jasmine.createSpyObj('Templates', ['getTemplate']);
    mockXtag = jasmine.createSpyObj('Xtag', ['register']);
    registrar = new ElementRegistrar(mockInjector, mockTemplates, mockXtag);
    TestDispose.add(registrar);
  });

  describe('getLifecycleConfig_', () => {
    let mockProvider;

    beforeEach(() => {
      mockProvider = jasmine.createSpy('provider');
    });

    it('should return config with correct attributeChanged handler', () => {
      const attrName = 'attrName';
      const oldValue = 'oldValue';
      const newValue = 'newValue';
      const mockHTMLElement = Mocks.object('HTMLElement');
      const mockElement = jasmine.createSpyObj('Element', ['onAttributeChanged']);

      const parsedValue = Mocks.object('parsedValue');
      const mockAttributeParser = jasmine.createSpyObj('AttributeParser', ['parse']);
      mockAttributeParser.parse.and.returnValue(parsedValue);

      const runOnInstanceSpy = spyOn(ElementRegistrar, 'runOnInstance_');

      registrar['getLifecycleConfig_']({[attrName]: mockAttributeParser}, mockProvider, 'content')
          .attributeChanged.call(mockHTMLElement, 'attr-name', oldValue, newValue);

      mockHTMLElement[attrName] = parsedValue;
      assert(mockAttributeParser.parse).to.haveBeenCalledWith(newValue);

      assert(ElementRegistrar['runOnInstance_'])
          .to.haveBeenCalledWith(mockHTMLElement, <any> Matchers.any(Function));

      runOnInstanceSpy.calls.argsFor(0)[1](mockElement);
      assert(mockElement.onAttributeChanged).to.haveBeenCalledWith('attr-name', oldValue, newValue);
    });

    it('should return config with correct created handler', () => {
      const content = 'content';
      const mockShadowRoot = Mocks.object('ShadowRoot');
      const mockHTMLElement = jasmine.createSpyObj('HTMLElement', ['createShadowRoot']);
      const mockElement = Mocks.disposable('Element');
      mockElement.onCreated = jasmine.createSpy('onCreated');
      mockProvider.and.returnValue(mockElement);

      const attributes = Mocks.object('attributes');

      mockHTMLElement.createShadowRoot.and.returnValue(mockShadowRoot);

      const binder1 = Mocks.object('binder1');
      const binder2 = Mocks.object('binder2');

      const mockBinderFactory1 = jasmine.createSpy('BinderFactory1').and.returnValue(binder1);
      const mockBinderFactory2 = jasmine.createSpy('BinderFactory2').and.returnValue(binder2);

      const key1 = 'key1';
      const mockBridge1 = jasmine.createSpyObj('Bridge1', ['open']);
      Object.setPrototypeOf(mockBridge1, DomHook.prototype);
      mockElement[key1] = mockBridge1;

      const key2 = 'key2';
      const mockBridge2 = jasmine.createSpyObj('Bridge2', ['open']);
      Object.setPrototypeOf(mockBridge2, DomHook.prototype);
      mockElement[key2] = mockBridge2;

      const binderMap = new Map();
      binderMap.set(key1, new Set([mockBinderFactory1]));
      binderMap.set(key2, new Set([mockBinderFactory2]));
      const mockBindAnnotations = jasmine.createSpyObj('BindAnnotations', ['getAttachedValues']);
      mockBindAnnotations.getAttachedValues.and.returnValue(binderMap);
      spyOn(BindAnnotations, 'forCtor').and.returnValue(mockBindAnnotations);

      spyOn(CustomElementUtil, 'addAttributes');
      spyOn(CustomElementUtil, 'setElement');

      registrar['getLifecycleConfig_'](attributes, mockProvider, content).created
          .call(mockHTMLElement);

      assert(mockHTMLElement[ElementRegistrar['__instance']]).to.equal(mockElement);
      assert(mockElement.onCreated).to.haveBeenCalledWith(mockHTMLElement);
      assert(mockShadowRoot.innerHTML).to.equal(content);
      assert(CustomElementUtil.addAttributes).to.haveBeenCalledWith(mockHTMLElement, attributes);
      assert(CustomElementUtil.setElement).to.haveBeenCalledWith(mockElement, mockHTMLElement);
      assert(mockBridge1.open).to.haveBeenCalledWith(binder1);
      assert(mockBridge2.open).to.haveBeenCalledWith(binder2);
      assert(mockBinderFactory1).to.haveBeenCalledWith(mockHTMLElement, mockElement);
      assert(mockBinderFactory2).to.haveBeenCalledWith(mockHTMLElement, mockElement);
      assert(BindAnnotations.forCtor).to.haveBeenCalledWith(mockElement.constructor);
    });

    it('should return config with correct inserted handler', () => {
      const mockHtmlElement = Mocks.object('HTMLElement');
      const mockElement = jasmine.createSpyObj('Component', ['onInserted']);

      const runOnInstanceSpy = spyOn(ElementRegistrar, 'runOnInstance_');

      registrar['getLifecycleConfig_']({}, mockProvider, 'content').inserted.call(mockHtmlElement);

      assert(ElementRegistrar['runOnInstance_'])
          .to.haveBeenCalledWith(mockHtmlElement, <any> Matchers.any(Function));

      runOnInstanceSpy.calls.argsFor(0)[1](mockElement);
      assert(mockElement.onInserted).to.haveBeenCalledWith(mockHtmlElement);
    });

    it('should return config with correct removed handler', () => {
      const mockHtmlElement = Mocks.object('HTMLElement');
      const mockElement = jasmine.createSpyObj('Element', ['onRemoved']);

      const runOnInstanceSpy = spyOn(ElementRegistrar, 'runOnInstance_');

      registrar['getLifecycleConfig_']({}, mockProvider, 'content').removed.call(mockHtmlElement);

      assert(ElementRegistrar['runOnInstance_'])
          .to.haveBeenCalledWith(mockHtmlElement, <any> Matchers.any(Function));

      runOnInstanceSpy.calls.argsFor(0)[1](mockElement);
      assert(mockElement.onRemoved).to.haveBeenCalledWith(mockHtmlElement);
    });
  });

  describe('register', () => {
    let ctor;

    beforeEach(() => {
      ctor = Mocks.object('ctor');
    });

    it('should return promise that registers the element correctly', async (done: any) => {
      const mockDependency = Mocks.object('Dependency');
      const name = 'name';
      const templateKey = 'templateKey';
      const attributes = Mocks.object('attributes');

      const originalRegister = registrar.register.bind(registrar);
      Fakes.build(spyOn(registrar, 'register'))
          .when(mockDependency).resolve(1)
          .else().call((inputCtor: any) => originalRegister(ctor));

      const mockConfig = {
        attributes: attributes,
        dependencies: [mockDependency],
        tag: name,
        templateKey: templateKey,
      };
      spyOn(CustomElementUtil, 'getConfig').and.returnValue(mockConfig);

      const templateContent = 'templateContent';
      mockTemplates.getTemplate.and.returnValue(templateContent);

      const mockLifecycleConfig = Mocks.object('LifecycleConfig');
      spyOn(registrar, 'getLifecycleConfig_').and.returnValue(mockLifecycleConfig);

      const instance = Mocks.object('instance');
      mockInjector.instantiate.and.returnValue(instance);

      await registrar.register(mockConfig);
      assert(mockXtag.register).to.haveBeenCalledWith(
          name,
          {
            lifecycle: mockLifecycleConfig,
          });

      assert(registrar['getLifecycleConfig_'])
          .to.haveBeenCalledWith(attributes, Matchers.any(Function), templateContent);
      assert(registrar['getLifecycleConfig_'].calls.argsFor(0)[1]()).to.equal(instance);
      assert(mockInjector.instantiate).to.haveBeenCalledWith(ctor);

      assert(<boolean> registrar['registeredCtors_'].has(ctor)).to.beTrue();
      assert(registrar.register).to.haveBeenCalledWith(mockDependency);

      assert(mockTemplates.getTemplate).to.haveBeenCalledWith(templateKey);
    });

    it('should log error if the template key does not exist', async (done: any) => {
      spyOn(Log, 'error');
      mockTemplates.getTemplate.and.returnValue(null);

      spyOn(CustomElementUtil, 'getConfig').and.returnValue({
        dependencies: [],
        tag: 'name',
        templateKey: 'templateKey',
      });

      try {
        await registrar.register(ctor);
        done.fail();
      } catch (e) {
        const error: Error = e;
        assert(error.message).to.match(/No templates found for key/);
      }
    });

    it('should be noop if the config has been registered', async (done: any) => {
      registrar['registeredCtors_'].add(ctor);

      await registrar.register(ctor);
      assert(mockXtag.register).toNot.haveBeenCalled();
    });

    it('should be noop if the ctor has no configs', async (done: any) => {
      spyOn(CustomElementUtil, 'getConfig').and.returnValue(null);
      await registrar.register(ctor);
      assert(mockXtag.register).toNot.haveBeenCalled();
    });
  });

  describe('runOnInstance_', () => {
    it('should call the callback correctly', () => {
      const mockCallback = jasmine.createSpy('Callback');
      const mockElement = Mocks.object('Element');
      const mockInstance = Mocks.object('Instance');
      Object.setPrototypeOf(mockInstance, BaseElement.prototype);

      mockElement[ElementRegistrar['__instance']] = mockInstance;

      ElementRegistrar['runOnInstance_'](mockElement, mockCallback);

      assert(mockCallback).to.haveBeenCalledWith(mockInstance);
    });

    it('should throw error if the instance is not an instance of BaseElement', () => {
      const mockCallback = jasmine.createSpy('Callback');
      const mockElement = Mocks.object('Element');
      const mockInstance = Mocks.object('Instance');

      mockElement[ElementRegistrar['__instance']] = mockInstance;

      assert(() => {
        ElementRegistrar['runOnInstance_'](mockElement, mockCallback);
      }).to.throwError(/Cannot find valid instance/);
    });
  });
});

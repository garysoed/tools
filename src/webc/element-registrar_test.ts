import {assert, Matchers, TestBase} from '../test-base';
TestBase.setup();

import {Mocks} from '../mock/mocks';
import {TestDispose} from '../testing/test-dispose';
import {Log} from '../util/log';

import {BaseElement} from './base-element';
import {ANNOTATIONS as BindAnnotations} from './bind';
import {CustomElementUtil} from './custom-element-util';
import {DomBridge} from './dom-bridge';
import {ElementRegistrar} from './element-registrar';


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
      let attrName = 'attrName';
      let oldValue = 'oldValue';
      let newValue = 'newValue';
      let mockHTMLElement = Mocks.object('HTMLElement');
      let mockElement = jasmine.createSpyObj('Element', ['onAttributeChanged']);

      let parsedValue = Mocks.object('parsedValue');
      let mockAttributeParser = jasmine.createSpyObj('AttributeParser', ['parse']);
      mockAttributeParser.parse.and.returnValue(parsedValue);

      let runOnInstanceSpy = spyOn(ElementRegistrar, 'runOnInstance_');

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
      let content = 'content';
      let mockShadowRoot = Mocks.object('ShadowRoot');
      let mockHTMLElement = jasmine.createSpyObj('HTMLElement', ['createShadowRoot']);
      let mockElement = Mocks.disposable('Element');
      mockElement.onCreated = jasmine.createSpy('onCreated');
      mockProvider.and.returnValue(mockElement);

      let attributes = Mocks.object('attributes');

      mockHTMLElement.createShadowRoot.and.returnValue(mockShadowRoot);

      let binder1 = Mocks.object('binder1');
      let binder2 = Mocks.object('binder2');

      let mockBinderFactory1 = jasmine.createSpy('BinderFactory1').and.returnValue(binder1);
      let mockBinderFactory2 = jasmine.createSpy('BinderFactory2').and.returnValue(binder2);

      let key1 = 'key1';
      let mockBridge1 = jasmine.createSpyObj('Bridge1', ['open']);
      Object.setPrototypeOf(mockBridge1, DomBridge.prototype);
      mockElement[key1] = mockBridge1;

      let key2 = 'key2';
      let mockBridge2 = jasmine.createSpyObj('Bridge2', ['open']);
      Object.setPrototypeOf(mockBridge2, DomBridge.prototype);
      mockElement[key2] = mockBridge2;

      let binderMap = new Map();
      binderMap.set(key1, mockBinderFactory1);
      binderMap.set(key2, mockBinderFactory2);
      let mockBindAnnotations = jasmine.createSpyObj('BindAnnotations', ['getAttachedValues']);
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
      let mockHtmlElement = Mocks.object('HTMLElement');
      let mockElement = jasmine.createSpyObj('Component', ['onInserted']);

      let runOnInstanceSpy = spyOn(ElementRegistrar, 'runOnInstance_');

      registrar['getLifecycleConfig_']({}, mockProvider, 'content').inserted.call(mockHtmlElement);

      assert(ElementRegistrar['runOnInstance_'])
          .to.haveBeenCalledWith(mockHtmlElement, <any> Matchers.any(Function));

      runOnInstanceSpy.calls.argsFor(0)[1](mockElement);
      assert(mockElement.onInserted).to.haveBeenCalledWith(mockHtmlElement);
    });

    it('should return config with correct removed handler', () => {
      let mockHtmlElement = Mocks.object('HTMLElement');
      let mockElement = jasmine.createSpyObj('Element', ['onRemoved']);

      let runOnInstanceSpy = spyOn(ElementRegistrar, 'runOnInstance_');

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

    it('should return promise that registers the element correctly', (done: any) => {
      let mockDependency = Mocks.object('Dependency');
      let name = 'name';
      let templateKey = 'templateKey';
      let attributes = Mocks.object('attributes');

      let originalRegister = registrar.register.bind(registrar);
      spyOn(registrar, 'register').and.callFake((inputCtor: any) => {
        switch (inputCtor) {
          case mockDependency:
            return Promise.resolve();
          default:
            return originalRegister(ctor);
        }
      });

      let mockConfig = {
        attributes: attributes,
        dependencies: [mockDependency],
        tag: name,
        templateKey: templateKey,
      };
      spyOn(CustomElementUtil, 'getConfig').and.returnValue(mockConfig);

      let templateContent = 'templateContent';
      mockTemplates.getTemplate.and.returnValue(templateContent);

      let mockLifecycleConfig = Mocks.object('LifecycleConfig');
      spyOn(registrar, 'getLifecycleConfig_').and.returnValue(mockLifecycleConfig);

      let instance = Mocks.object('instance');
      mockInjector.instantiate.and.returnValue(instance);

      registrar.register(mockConfig)
          .then(() => {
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
            done();
          }, done.fail);
    });

    it('should log error if the template key does not exist', (done: any) => {
      spyOn(Log, 'error');
      mockTemplates.getTemplate.and.returnValue(null);

      spyOn(CustomElementUtil, 'getConfig').and.returnValue({
        dependencies: [],
        tag: 'name',
        templateKey: 'templateKey',
      });

      registrar.register(ctor)
          .then(done.fail, (error: Error) => {
            assert(error.message)
                .to.match(/No templates found for key/);
            done();
          });
    });

    it('should be noop if the config has been registered', (done: any) => {
      registrar['registeredCtors_'].add(ctor);

      registrar.register(ctor)
          .then(() => {
            assert(mockXtag.register).toNot.haveBeenCalled();
            done();
          }, done.fail);
    });

    it('should be noop if the ctor has no configs', (done: any) => {
      spyOn(CustomElementUtil, 'getConfig').and.returnValue(null);
      registrar.register(ctor)
          .then(() => {
            assert(mockXtag.register).toNot.haveBeenCalled();
            done();
          }, done.fail);
    });
  });

  describe('runOnInstance_', () => {
    it('should call the callback correctly', () => {
      let mockCallback = jasmine.createSpy('Callback');
      let mockElement = Mocks.object('Element');
      let mockInstance = Mocks.object('Instance');
      Object.setPrototypeOf(mockInstance, BaseElement.prototype);

      mockElement[ElementRegistrar['__instance']] = mockInstance;

      ElementRegistrar['runOnInstance_'](mockElement, mockCallback);

      assert(mockCallback).to.haveBeenCalledWith(mockInstance);
    });

    it('should throw error if the instance is not an instance of BaseElement', () => {
      let mockCallback = jasmine.createSpy('Callback');
      let mockElement = Mocks.object('Element');
      let mockInstance = Mocks.object('Instance');

      mockElement[ElementRegistrar['__instance']] = mockInstance;

      assert(() => {
        ElementRegistrar['runOnInstance_'](mockElement, mockCallback);
      }).to.throwError(/Cannot find valid instance/);
    });
  });
});

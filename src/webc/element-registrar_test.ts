import { assert, Matchers, TestBase } from '../test-base';
TestBase.setup();

import { MonadUtil } from '../event/monad-util';
import { ImmutableMap } from '../immutable/immutable-map';
import { ImmutableSet } from '../immutable/immutable-set';
import { Fakes } from '../mock/fakes';
import { Mocks } from '../mock/mocks';
import { TestDispose } from '../testing/test-dispose';
import { Log } from '../util/log';
import { BaseElement } from '../webc/base-element';
import { ElementRegistrar } from '../webc/element-registrar';
import { Handler } from '../webc/handle';
import { ANNOTATIONS as LIFECYCLE_ANNOTATIONS } from '../webc/on-lifecycle';
import { Util } from '../webc/util';


describe('webc.ElementRegistrar', () => {
  let mockInjector: any;
  let mockTemplates: any;
  let mockXtag: any;
  let registrar: ElementRegistrar;

  beforeEach(() => {
    mockInjector = jasmine.createSpyObj('Injector', ['instantiate']);
    mockTemplates = jasmine.createSpyObj('Templates', ['getTemplate']);
    mockXtag = jasmine.createSpyObj('Xtag', ['register']);
    registrar = new ElementRegistrar(mockInjector, mockTemplates, mockXtag);
    TestDispose.add(registrar);
  });

  describe('getLifecycleConfig_', () => {
    let mockProvider: any;

    beforeEach(() => {
      mockProvider = jasmine.createSpy('provider');
    });

    it('should return config with correct created handler', () => {
      const content = 'content';
      const attributes = Mocks.object('attributes');
      const mockInstance = jasmine.createSpyObj('Instance', ['dispose']);
      mockProvider.and.returnValue(mockInstance);

      const mockShadowRoot = Mocks.object('ShadowRoot');
      const mockHTMLElement = jasmine.createSpyObj('HTMLElement', ['attachShadow']);
      mockHTMLElement.attachShadow.and.returnValue(mockShadowRoot);

      spyOn(MonadUtil, 'callFunction');
      spyOn(Util, 'addAttributes');
      spyOn(Util, 'setElement');
      spyOn(Handler, 'configure');

      const key1 = 'key1';
      const key2 = 'key2';
      spyOn(registrar, 'getMethodsWithLifecycle_').and.returnValue(ImmutableSet.of([key1, key2]));

      const lifecycleConfig = registrar['getLifecycleConfig_'](attributes, mockProvider, content);
      lifecycleConfig.created!.call(mockHTMLElement);

      assert(Handler.configure).to.haveBeenCalledWith(mockHTMLElement, mockInstance);
      assert(MonadUtil.callFunction).to
          .haveBeenCalledWith({type: 'create'}, mockInstance, key1);
      assert(MonadUtil.callFunction).to
          .haveBeenCalledWith({type: 'create'}, mockInstance, key2);
      assert(registrar['getMethodsWithLifecycle_']).to.haveBeenCalledWith('create', mockInstance);
      assert(Util.setElement).to.haveBeenCalledWith(mockInstance, mockHTMLElement);
      assert(mockShadowRoot.innerHTML).to.equal(content);
      assert(mockHTMLElement.attachShadow).to.haveBeenCalledWith({mode: 'open'});
      assert(mockHTMLElement[ElementRegistrar['__instance']]).to.equal(mockInstance);
    });

    it('should return config with correct inserted handler', () => {
      const instance = Mocks.object('instance');
      const mockHTMLElement = Mocks.object('HTMLElement');

      Fakes.build(spyOn(ElementRegistrar, 'runOnInstance_'))
          .call((_: any, callback: Function) => callback(instance));
      const key1 = 'key1';
      const key2 = 'key2';
      spyOn(registrar, 'getMethodsWithLifecycle_').and.returnValue(ImmutableSet.of([key1, key2]));

      spyOn(MonadUtil, 'callFunction');

      const lifecycleConfig = registrar['getLifecycleConfig_']({}, mockProvider, 'content');
      lifecycleConfig.inserted!.call(mockHTMLElement);

      assert(ElementRegistrar['runOnInstance_'])
          .to.haveBeenCalledWith(mockHTMLElement, jasmine.any(Function) as any);

      assert(MonadUtil.callFunction).to
          .haveBeenCalledWith({type: 'insert'}, instance, key1);
      assert(MonadUtil.callFunction).to
          .haveBeenCalledWith({type: 'insert'}, instance, key2);
      assert(registrar['getMethodsWithLifecycle_']).to.haveBeenCalledWith('insert', instance);
    });

    it('should return config with correct removed handler', () => {
      const instance = Mocks.object('instance');
      const mockHTMLElement = Mocks.object('HTMLElement');

      Fakes.build(spyOn(ElementRegistrar, 'runOnInstance_'))
          .call((_: any, callback: Function) => callback(instance));
      const key1 = 'key1';
      const key2 = 'key2';
      spyOn(registrar, 'getMethodsWithLifecycle_').and.returnValue(ImmutableSet.of([key1, key2]));

      spyOn(MonadUtil, 'callFunction');

      const lifecycleConfig = registrar['getLifecycleConfig_']({}, mockProvider, 'content');
      lifecycleConfig.removed!.call(mockHTMLElement);

      assert(ElementRegistrar['runOnInstance_'])
          .to.haveBeenCalledWith(mockHTMLElement, jasmine.any(Function) as any);

      assert(MonadUtil.callFunction).to
          .haveBeenCalledWith({type: 'remove'}, instance, key1);
      assert(MonadUtil.callFunction).to
          .haveBeenCalledWith({type: 'remove'}, instance, key2);
      assert(registrar['getMethodsWithLifecycle_']).to.haveBeenCalledWith('remove', instance);
    });
  });

  describe('getMethodsWithLifecycle_', () => {
    it('should return the correct methods', () => {
      class TestClass { }
      const instance = new TestClass();
      const lifecycle = 'insert';

      const mockLifecycleAnnotations = jasmine
          .createSpyObj('LifecycleAnnotations', ['getAttachedValues']);
      const method1 = 'method1';
      const method2 = 'method2';
      mockLifecycleAnnotations.getAttachedValues.and.returnValue(ImmutableMap.of([
        [method1, ImmutableSet.of([lifecycle, 'create'])],
        [method2, ImmutableSet.of([lifecycle])],
        ['method3', ImmutableSet.of(['remove'])],
      ]));
      spyOn(LIFECYCLE_ANNOTATIONS, 'forCtor').and.returnValue(mockLifecycleAnnotations);

      assert(registrar['getMethodsWithLifecycle_'](lifecycle, instance))
          .to.haveElements([method1, method2]);
      assert(LIFECYCLE_ANNOTATIONS.forCtor).to.haveBeenCalledWith(TestClass);
    });
  });

  describe('register', () => {
    let ctor: any;

    beforeEach(() => {
      ctor = Mocks.object('ctor');
    });

    it('should return promise that registers the element correctly', async () => {
      const mockDependency = Mocks.object('Dependency');
      const name = 'name';
      const templateKey = 'templateKey';
      const attributes = Mocks.object('attributes');

      const originalRegister = registrar.register.bind(registrar);
      Fakes.build(spyOn(registrar, 'register'))
          .when(mockDependency).resolve(1)
          .else().call((_: any) => originalRegister(ctor));

      const mockConfig = {
        attributes: attributes,
        dependencies: ImmutableSet.of([mockDependency]),
        tag: name,
        templateKey: templateKey,
      };
      spyOn(Util, 'getConfig').and.returnValue(mockConfig);

      const templateContent = 'templateContent';
      mockTemplates.getTemplate.and.returnValue(templateContent);

      const mockLifecycleConfig = Mocks.object('LifecycleConfig');
      const spy = spyOn(registrar, 'getLifecycleConfig_').and.returnValue(mockLifecycleConfig);

      const instance = Mocks.object('instance');
      mockInjector.instantiate.and.returnValue(instance);

      await registrar.register(ctor);
      assert(mockXtag.register).to.haveBeenCalledWith(
          name,
          {
            lifecycle: mockLifecycleConfig,
          });

      assert(registrar['getLifecycleConfig_'])
          .to.haveBeenCalledWith(attributes, Matchers.any(Function) as any, templateContent);
      assert(spy.calls.argsFor(0)[1]()).to.equal(instance);
      assert(mockInjector.instantiate).to.haveBeenCalledWith(ctor);

      assert(registrar['registeredCtors_'].has(ctor) as boolean).to.beTrue();
      assert(registrar.register).to.haveBeenCalledWith(mockDependency);

      assert(mockTemplates.getTemplate).to.haveBeenCalledWith(templateKey);
    });

    it('should log error if the template key does not exist', async () => {
      spyOn(Log, 'error');
      mockTemplates.getTemplate.and.returnValue(null);

      spyOn(Util, 'getConfig').and.returnValue({
        dependencies: ImmutableSet.of([]),
        tag: 'name',
        templateKey: 'templateKey',
      });

      await assert(registrar.register(ctor)).to.rejectWithError(/No templates found for key/);
    });

    it('should be noop if the config has been registered', async () => {
      registrar['registeredCtors_'].add(ctor);

      await registrar.register(ctor);
      assert(mockXtag.register).toNot.haveBeenCalled();
    });

    it('should be noop if the ctor has no configs', async () => {
      spyOn(Util, 'getConfig').and.returnValue(null);
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

import {TestBase} from '../test-base';
TestBase.setup();

import {BaseElement} from './base-element';
import {CustomElementUtil} from './custom-element-util';
import {ElementRegistrar} from './element-registrar';
import {Log} from '../util/log';
import {Mocks} from '../mock/mocks';
import {TestDispose} from '../testing/test-dispose';


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
      expect(mockAttributeParser.parse).toHaveBeenCalledWith(newValue);

      expect(ElementRegistrar['runOnInstance_'])
          .toHaveBeenCalledWith(mockHTMLElement, jasmine.any(Function));

      runOnInstanceSpy.calls.argsFor(0)[1](mockElement);
      expect(mockElement.onAttributeChanged).toHaveBeenCalledWith('attr-name', oldValue, newValue);
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

      spyOn(CustomElementUtil, 'addAttributes');
      spyOn(CustomElementUtil, 'setElement');

      registrar['getLifecycleConfig_'](attributes, mockProvider, content).created
          .call(mockHTMLElement);

      expect(mockHTMLElement[ElementRegistrar['__instance']]).toEqual(mockElement);
      expect(mockElement.onCreated).toHaveBeenCalledWith(mockHTMLElement);
      expect(mockShadowRoot.innerHTML).toEqual(content);
      expect(CustomElementUtil.addAttributes).toHaveBeenCalledWith(mockHTMLElement, attributes);
      expect(CustomElementUtil.setElement).toHaveBeenCalledWith(mockElement, mockHTMLElement);
    });

    it('should return config with correct inserted handler', () => {
      let mockHTMLElement = Mocks.object('HTMLElement');
      let mockElement = jasmine.createSpyObj('Component', ['onInserted']);

      let runOnInstanceSpy = spyOn(ElementRegistrar, 'runOnInstance_');

      registrar['getLifecycleConfig_']({}, mockProvider, 'content').inserted.call(mockHTMLElement);

      expect(ElementRegistrar['runOnInstance_'])
          .toHaveBeenCalledWith(mockHTMLElement, jasmine.any(Function));

      runOnInstanceSpy.calls.argsFor(0)[1](mockElement);
      expect(mockElement.onInserted).toHaveBeenCalledWith();
    });

    it('should return config with correct removed handler', () => {
      let mockHTMLElement = Mocks.object('HTMLElement');
      let mockElement = jasmine.createSpyObj('Element', ['onRemoved']);

      let runOnInstanceSpy = spyOn(ElementRegistrar, 'runOnInstance_');

      registrar['getLifecycleConfig_']({}, mockProvider, 'content').removed.call(mockHTMLElement);

      expect(ElementRegistrar['runOnInstance_'])
          .toHaveBeenCalledWith(mockHTMLElement, jasmine.any(Function));

      runOnInstanceSpy.calls.argsFor(0)[1](mockElement);
      expect(mockElement.onRemoved).toHaveBeenCalledWith();
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
            expect(mockXtag.register).toHaveBeenCalledWith(
                name,
                {
                  lifecycle: mockLifecycleConfig,
                });

            expect(registrar['getLifecycleConfig_'])
                .toHaveBeenCalledWith(attributes, jasmine.any(Function), templateContent);
            expect(registrar['getLifecycleConfig_'].calls.argsFor(0)[1]()).toEqual(instance);
            expect(mockInjector.instantiate).toHaveBeenCalledWith(ctor);

            expect(registrar['registeredCtors_'].has(ctor)).toBe(true);
            expect(registrar.register).toHaveBeenCalledWith(mockDependency);

            expect(mockTemplates.getTemplate).toHaveBeenCalledWith(templateKey);
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
            expect(error.message)
                .toEqual(jasmine.stringMatching(/No templates found for key/));
            done();
          });
    });

    it('should be noop if the config has been registered', (done: any) => {
      registrar['registeredCtors_'].add(ctor);

      registrar.register(ctor)
          .then(() => {
            expect(mockXtag.register).not.toHaveBeenCalled();
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

      expect(mockCallback).toHaveBeenCalledWith(mockInstance);
    });

    it('should throw error if the instance is not an instance of BaseElement', () => {
      let mockCallback = jasmine.createSpy('Callback');
      let mockElement = Mocks.object('Element');
      let mockInstance = Mocks.object('Instance');

      mockElement[ElementRegistrar['__instance']] = mockInstance;

      expect(() => {
        ElementRegistrar['runOnInstance_'](mockElement, mockCallback);
      }).toThrowError(/Cannot find valid instance/);
    });
  });
});

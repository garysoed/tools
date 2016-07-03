import TestBase from '../test-base';
TestBase.setup();

import {BaseElement} from './base-element';
import {ElementConfig} from './element-config';
import {ElementRegistrar} from './element-registrar';
import Log from '../log';
import {Mocks} from '../mock/mocks';
import {Templates} from './templates';
import TestDispose from '../testing/test-dispose';


describe('webc.ElementRegistrar', () => {
  let mockXtag;
  let registrar;

  beforeEach(() => {
    mockXtag = jasmine.createSpyObj('Xtag', ['register']);
    registrar = new ElementRegistrar(mockXtag);
    TestDispose.add(registrar);
  });

  describe('getLifecycleConfig_', () => {
    let mockProvider;
    let mockConfig;

    beforeEach(() => {
      mockProvider = jasmine.createSpy('provider');
      mockConfig = {provider: mockProvider};
    });

    it('should return config with correct attributeChanged handler', () => {
      let attrName = 'attrName';
      let oldValue = 'oldValue';
      let newValue = 'newValue';
      let mockHTMLElement = Mocks.object('HTMLElement');
      let mockElement = jasmine.createSpyObj('Element', ['onAttributeChanged']);

      let runOnInstanceSpy = spyOn(ElementRegistrar, 'runOnInstance_');

      registrar['getLifecycleConfig_'](mockConfig, 'content')
          .attributeChanged.call(mockHTMLElement, attrName, oldValue, newValue);

      expect(ElementRegistrar['runOnInstance_'])
          .toHaveBeenCalledWith(mockHTMLElement, jasmine.any(Function));

      runOnInstanceSpy.calls.argsFor(0)[1](mockElement);
      expect(mockElement.onAttributeChanged).toHaveBeenCalledWith(attrName, oldValue, newValue);
    });

    it('should return config with correct created handler', () => {
      let content = 'content';
      let mockShadowRoot = Mocks.object('ShadowRoot');
      let mockHTMLElement = jasmine.createSpyObj('HTMLElement', ['createShadowRoot']);
      let mockElement = Mocks.disposable('Element');
      mockElement.onCreated = jasmine.createSpy('onCreated');
      mockProvider.and.returnValue(mockElement);

      mockHTMLElement.createShadowRoot.and.returnValue(mockShadowRoot);

      registrar['getLifecycleConfig_'](mockConfig, content).created.call(mockHTMLElement);

      expect(mockHTMLElement[ElementRegistrar['__instance']]).toEqual(mockElement);
      expect(mockElement.onCreated).toHaveBeenCalledWith(mockHTMLElement);
      expect(mockShadowRoot.innerHTML).toEqual(content);
    });

    it('should return config with correct inserted handler', () => {
      let mockHTMLElement = Mocks.object('HTMLElement');
      let mockElement = jasmine.createSpyObj('Component', ['onInserted']);

      let runOnInstanceSpy = spyOn(ElementRegistrar, 'runOnInstance_');

      registrar['getLifecycleConfig_'](mockConfig, 'content').inserted.call(mockHTMLElement);

      expect(ElementRegistrar['runOnInstance_'])
          .toHaveBeenCalledWith(mockHTMLElement, jasmine.any(Function));

      runOnInstanceSpy.calls.argsFor(0)[1](mockElement);
      expect(mockElement.onInserted).toHaveBeenCalledWith();
    });

    it('should return config with correct removed handler', () => {
      let mockHTMLElement = Mocks.object('HTMLElement');
      let mockElement = jasmine.createSpyObj('Element', ['onRemoved']);

      let runOnInstanceSpy = spyOn(ElementRegistrar, 'runOnInstance_');

      registrar['getLifecycleConfig_']('content').removed.call(mockHTMLElement);

      expect(ElementRegistrar['runOnInstance_'])
          .toHaveBeenCalledWith(mockHTMLElement, jasmine.any(Function));

      runOnInstanceSpy.calls.argsFor(0)[1](mockElement);
      expect(mockElement.onRemoved).toHaveBeenCalledWith();
    });
  });

  describe('register', () => {
    it('should return promise that registers the element correctly', (done: any) => {
      let mockDependency = Mocks.object('Dependency');
      let name = 'name';
      let templateKey = 'templateKey';

      let originalRegister = registrar.register.bind(registrar);
      spyOn(registrar, 'register').and.callFake((config: ElementConfig) => {
        switch (config) {
          case mockDependency:
            return Promise.resolve();
          default:
            return originalRegister(config);
        }
      });

      let mockConfig = {
        dependencies: [mockDependency],
        name: name,
        templateKey: templateKey,
      };

      let templateContent = 'templateContent';
      spyOn(Templates, 'getTemplate').and.returnValue(templateContent);

      let mockLifecycleConfig = Mocks.object('LifecycleConfig');
      spyOn(registrar, 'getLifecycleConfig_').and.returnValue(mockLifecycleConfig);

      registrar.register(mockConfig)
          .then(() => {
            expect(mockXtag.register).toHaveBeenCalledWith(
                name,
                {
                  lifecycle: mockLifecycleConfig,
                });
            expect(registrar['getLifecycleConfig_'])
                .toHaveBeenCalledWith(mockConfig, templateContent);

            expect(registrar['registeredConfigs_'].has(mockConfig)).toBe(true);
            expect(registrar.register).toHaveBeenCalledWith(mockDependency);

            expect(Templates.getTemplate).toHaveBeenCalledWith(templateKey);
            done();
          }, done.fail);
    });

    it('should log error if the template key does not exist', (done: any) => {
      spyOn(Log, 'error');
      spyOn(Templates, 'getTemplate').and.returnValue(null);

      registrar.register({dependencies: [], name: 'name', templateKey: 'templateKey'})
          .then(done.fail, (error: Error) => {
            expect(error.message)
                .toEqual(jasmine.stringMatching(/No templates found for key/));
            done();
          });
    });

    it('should be noop if the config has been registered', (done: any) => {
      let mockConfig = {};
      registrar['registeredConfigs_'].add(mockConfig);

      registrar.register(mockConfig)
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

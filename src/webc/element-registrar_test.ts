import TestBase from '../test-base';
TestBase.setup();

import {BaseElement} from './base-element';
import {ElementConfig} from './element-config';
import {ElementRegistrar} from './element-registrar';
import Http from '../net/http';
import Log from '../log';
import {Mocks} from '../mock/mocks';
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
      let cssUrl = 'cssUrl';
      let name = 'name';
      let templateUrl = 'templateUrl';

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
        cssUrl: cssUrl,
        dependencies: [mockDependency],
        name: name,
        templateUrl: templateUrl,
      };

      let templateContent = 'templateContent';
      let mockTemplateRequest = jasmine.createSpyObj('TemplateRequest', ['send']);
      mockTemplateRequest.send.and.returnValue(Promise.resolve(templateContent));

      let cssContent = 'cssContent';
      let mockCssRequest = jasmine.createSpyObj('CssRequest', ['send']);
      mockCssRequest.send.and.returnValue(Promise.resolve(cssContent));

      spyOn(Http, 'get').and.callFake((url: string) => {
        switch (url) {
          case templateUrl:
            return mockTemplateRequest;
          case cssUrl:
            return mockCssRequest;
          default:
            return null;
        }
      });

      let mockLifecycleConfig = Mocks.object('LifecycleConfig');
      spyOn(registrar, 'getLifecycleConfig_').and.returnValue(mockLifecycleConfig);

      registrar.register(mockConfig)
          .then(() => {
            expect(mockXtag.register).toHaveBeenCalledWith(
                name,
                {
                  lifecycle: mockLifecycleConfig,
                });
            expect(registrar['getLifecycleConfig_']).toHaveBeenCalledWith(
                mockConfig,
                `<style>${cssContent}</style>\n${templateContent}`);

            expect(registrar['registeredConfigs_'].has(mockConfig)).toBe(true);
            expect(registrar.register).toHaveBeenCalledWith(mockDependency);
            done();
          }, done.fail);
    });

    it('should log error if the template URL failed to load', (done: any) => {
      let error = 'error';

      let mockTemplateRequest = jasmine.createSpyObj('TemplateRequest', ['send']);
      mockTemplateRequest.send.and.returnValue(Promise.resolve('templateContent'));

      spyOn(Http, 'get').and.returnValue(mockTemplateRequest);
      mockTemplateRequest.send.and.returnValue(Promise.reject(error));

      spyOn(Log, 'error');

      let mockConfig = {
        dependencies: [],
        templateUrl: 'templateUrl',
      };

      registrar.register(mockConfig)
          .then(() => {
            expect(Log.error).toHaveBeenCalledWith(
                jasmine.any(Log),
                jasmine.stringMatching(/Failed to register/));
            done();
          }, done.fail);
    });

    it('should handle the case with no CSS URLs', (done: any) => {
      let templateContent = 'templateContent';
      let mockTemplateRequest = jasmine.createSpyObj('TemplateRequest', ['send']);
      mockTemplateRequest.send.and.returnValue(Promise.resolve(templateContent));

      spyOn(Http, 'get').and.returnValue(mockTemplateRequest);

      let mockLifecycleConfig = Mocks.object('LifecycleConfig');
      spyOn(registrar, 'getLifecycleConfig_').and.returnValue(mockLifecycleConfig);

      let mockConfig = {
        dependencies: [],
        name: 'name',
        templateUrl: 'templateUrl',
      };

      registrar.register(mockConfig)
          .then(() => {
            expect(registrar['getLifecycleConfig_'])
                .toHaveBeenCalledWith(mockConfig, templateContent);
            done();
          }, done.fail);
    });

    it('should be noop if the config has been registered', (done: any) => {
      let mockConfig = {};
      registrar['registeredConfigs_'].add(mockConfig);

      spyOn(Http, 'get');

      registrar.register(mockConfig)
          .then(() => {
            expect(Http.get).not.toHaveBeenCalled();
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

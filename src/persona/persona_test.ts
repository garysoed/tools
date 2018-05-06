import { assert, Fakes, Mocks, TestBase } from '../test-base';
TestBase.setup();

import { NumberType } from '../check';
import { BaseDisposable } from '../dispose';
import { Graph, instanceId } from '../graph';
import { ImmutableSet } from '../immutable';
import { PersonaImpl } from '../persona/persona';
import { __shadowRoot } from '../persona/shadow-root-symbol';


describe('persona.Persona', () => {
  let mockCustomElements: any;
  let persona: PersonaImpl;

  beforeEach(() => {
    mockCustomElements = jasmine.createSpyObj('CustomElements', ['define']);
    persona = new PersonaImpl(mockCustomElements);
  });

  describe('define', () => {
    it(`should add the spec correctly`, () => {
      const ctrl = class extends BaseDisposable { };
      const spec = {
        tag: 'gs-test',
        templateKey: 'key',
      };

      persona.define(ctrl, spec);
      assert(persona['componentSpecs_']).to.haveEntries([[ctrl, spec]]);
    });

    it(`should throw error if the component is already registered`, () => {
      const ctrl = class extends BaseDisposable { };
      const spec = {
        tag: 'gs-test',
        templateKey: 'key',
      };
      persona['componentSpecs_'].set(ctrl, spec);

      assert(() => {
        persona.define(ctrl, spec);
      }).to.throwError(/is already registered/);
    });
  });

  describe('defineListener', () => {
    it(`should set the listener correctly`, () => {
      const propertyKey = 'propertyKey';

      class TestClass extends BaseDisposable {
        [propertyKey](): void { }
      }

      const listener = Mocks.object('listener');
      const useCapture = true;

      persona.defineListener(TestClass, propertyKey, listener, useCapture);
      assert(persona['listenerSpecs_'].get(TestClass)!.get(propertyKey)!).to.haveElements([{
        handler: TestClass.prototype[propertyKey],
        listener,
        useCapture,
      }]);
    });

    it(`should handle the case where the listener is already registered`, () => {
      const propertyKey = 'propertyKey';

      class TestClass extends BaseDisposable {
        [propertyKey](): void { }
      }

      const listener = Mocks.object('listener');
      const useCapture = true;
      const spec = Mocks.object('spec');
      persona['listenerSpecs_'].set(TestClass, new Map([[propertyKey, ImmutableSet.of([spec])]]));

      persona.defineListener(TestClass, propertyKey, listener, useCapture);
      assert(persona['listenerSpecs_'].get(TestClass)!.get(propertyKey)!).to.haveElements([
        spec,
        {
          handler: TestClass.prototype[propertyKey],
          listener,
          useCapture,
        }]);
    });

    it(`should throw error if the handler is not a function`, () => {
      class TestClass extends BaseDisposable { }

      const propertyKey = 'propertyKey';
      const listener = Mocks.object('listener');
      const useCapture = true;

      assert(() => {
        persona.defineListener(TestClass, propertyKey, listener, useCapture);
      }).to.throwError(/is not a Function/);
    });
  });

  describe('defineRenderer', () => {
    it(`should add the spec correctly`, () => {
      const ctrl = Mocks.object('ctrl');
      const propertyKey = 'propertyKey';
      const selector = Mocks.object('selector');
      const parameter1 = Mocks.object('parameter1');
      const parameter2 = Mocks.object('parameter2');

      persona.defineRenderer(ctrl, propertyKey, selector, parameter1, parameter2);
      assert(persona['rendererSpecs_'].get(ctrl)!).to
          .haveEntries([[propertyKey, {parameters: [parameter1, parameter2], selector}]]);
    });

    it(`should add the spec to an existing property map correctly`, () => {
      const ctrl = Mocks.object('ctrl');
      const propertyKey = 'propertyKey';
      const selector = Mocks.object('selector');

      const otherPropertyKey = 'otherPropertyKey';
      const otherSpec = Mocks.object('otherSpec');
      persona['rendererSpecs_'].set(ctrl, new Map([[otherPropertyKey, otherSpec]]));

      persona.defineRenderer(ctrl, propertyKey, selector);
      assert(persona['rendererSpecs_'].get(ctrl)!).to.haveEntries([
        [otherPropertyKey, otherSpec],
        [propertyKey, {parameters: [], selector}],
      ]);
    });

    it(`should error if the property has been registered`, () => {
      const ctrl = Mocks.object('ctrl');
      const propertyKey = 'propertyKey';
      const selector = Mocks.object('selector');

      const otherSpec = Mocks.object('otherSpec');
      persona['rendererSpecs_'].set(ctrl, new Map([[propertyKey, otherSpec]]));

      assert(() => {
        persona.defineRenderer(ctrl, propertyKey, selector);
      }).to.throwError(/is already registered/);
    });
  });

  describe('getAncestorSpecs_', () => {
    it(`should add the entries correctly`, () => {
      class ParentClass {
        methodA(): void { }
        methodB(): void { }
      }

      class ChildClass extends ParentClass {
        methodA(): void { }
        methodC(): void { }
      }

      const map = new Map([
        [
          ParentClass,
          new Map([
            ['methodA', 1],
            ['methodB', 2],
          ]),
        ],
        [
          ChildClass,
          new Map([
            ['methodA', 3],
            ['methodC', 4],
          ]),
        ],
      ]);

      assert(persona['getAncestorSpecs_'](ChildClass, map)).to.haveElements([
        ['methodB', 2],
        ['methodA', 3],
        ['methodC', 4],
      ]);
    });
  });

  describe('getShadowRoot', () => {
    it(`should return the root`, () => {
      const shadowRoot = Mocks.object('shadowRoot');
      Object.setPrototypeOf(shadowRoot, DocumentFragment.prototype);
      const ctrl = Mocks.object('ctrl');
      ctrl[__shadowRoot] = shadowRoot;

      assert(persona.getShadowRoot(ctrl)).to.equal(shadowRoot);
    });

    it(`should return null if the root is not a DocumentFragment`, () => {
      const shadowRoot = Mocks.object('shadowRoot');
      const ctrl = Mocks.object('ctrl');
      ctrl[__shadowRoot] = shadowRoot;

      assert(persona.getShadowRoot(ctrl)).to.beNull();
    });

    it(`should return null if the are no roots on the ctrl`, () => {
      const ctrl = Mocks.object('ctrl');

      assert(persona.getShadowRoot(ctrl)).to.beNull();
    });
  });

  describe('getValue', () => {
    it(`should return the correct value`, () => {
      const value = Mocks.object('value');
      const mockSelector = jasmine.createSpyObj('Selector', ['getValue']);
      mockSelector.getValue.and.returnValue(value);
      const ctrl = Mocks.object('ctrl');

      const shadowRoot = Mocks.object('shadowRoot');
      spyOn(persona, 'getShadowRoot').and.returnValue(shadowRoot);

      assert(persona.getValue(mockSelector, ctrl) as any).to.equal(value);
      assert(mockSelector.getValue).to.haveBeenCalledWith(shadowRoot);
      assert(persona.getShadowRoot).to.haveBeenCalledWith(ctrl);
    });

    it(`should throw error if the shadow root does not exist`, () => {
      const selector = Mocks.object('selector');
      const ctrl = Mocks.object('ctrl');
      spyOn(persona, 'getShadowRoot').and.returnValue(null);

      assert(() => {
        persona.getValue(selector, ctrl);
      }).to.throwError(/shadowRoot/);
    });
  });

  describe('register_', () => {
    it(`should register the dependencies and the custom element correctly`, () => {
      const injector = Mocks.object('injector');
      const ctrl = Mocks.object('ctrl');
      const parentCtor = HTMLDivElement;
      const parentTag = 'div' as 'div';
      const tag = 'tag';

      const templateContent = 'templateContent';
      const mockTemplates = jasmine.createSpyObj('Templates', ['getTemplate']);
      mockTemplates.getTemplate.and.returnValue(templateContent);

      const customElementClass = Mocks.object('customElementClass');
      spyOn(persona, 'createCustomElementClass_').and.returnValue(customElementClass);

      const templateKey = 'templateKey';
      const defaultAttrs = Mocks.object('defaultAttrs');
      const spec = {
        defaultAttrs,
        parent: {
          class: parentCtor,
          tag: parentTag,
        },
        tag,
        templateKey,
      };
      persona['componentSpecs_'].set(ctrl, spec);

      const inputProviders = Mocks.object('inputProviders');
      spyOn(persona, 'registerInputs_').and.returnValue(inputProviders);

      const listenerSpecs = Mocks.object('listenerSpecs');
      spyOn(persona, 'registerListeners_').and.returnValue(listenerSpecs);

      const rendererSpecs = Mocks.object('rendererSpecs');
      spyOn(persona, 'registerRenderers_').and.returnValue(rendererSpecs);

      spyOn(persona, 'registerDependencies_');
      spyOn(persona, 'registerCustomElement_');

      persona['register_'](injector, mockTemplates, ctrl);
      assert(persona['registeredSpecs_']).to.haveElements([ctrl]);
      assert(persona['registerCustomElement_']).to.haveBeenCalledWith(spec, customElementClass);
      assert(persona['createCustomElementClass_']).to.haveBeenCalledWith(
          parentCtor,
          templateContent,
          injector,
          ctrl,
          tag,
          inputProviders,
          listenerSpecs,
          rendererSpecs,
          defaultAttrs);
      assert(persona['registerListeners_']).to.haveBeenCalledWith(ctrl);
      assert(persona['registerRenderers_']).to.haveBeenCalledWith(ctrl);
      assert(persona['registerInputs_']).to.haveBeenCalledWith(spec);
      assert(persona['registerDependencies_']).to.haveBeenCalledWith(spec, injector, mockTemplates);
      assert(mockTemplates.getTemplate).to.haveBeenCalledWith(templateKey);
    });

    it(`should register with HTMLElement if the spec has no parents`, () => {
      const injector = Mocks.object('injector');
      const ctrl = Mocks.object('ctrl');
      const tag = 'tag';

      const templateContent = 'templateContent';
      const mockTemplates = jasmine.createSpyObj('Templates', ['getTemplate']);
      mockTemplates.getTemplate.and.returnValue(templateContent);

      spyOn(Graph, 'registerGenericProvider_');

      const customElementClass = Mocks.object('customElementClass');
      spyOn(persona, 'createCustomElementClass_').and.returnValue(customElementClass);

      const templateKey = 'templateKey';
      const spec = {
        tag,
        templateKey,
      };
      persona['componentSpecs_'].set(ctrl, spec);

      const inputProviders = Mocks.object('inputProviders');
      spyOn(persona, 'registerInputs_').and.returnValue(inputProviders);

      const listenerSpecs = Mocks.object('listenerSpecs');
      spyOn(persona, 'registerListeners_').and.returnValue(listenerSpecs);

      const rendererSpecs = Mocks.object('rendererSpecs');
      spyOn(persona, 'registerRenderers_').and.returnValue(rendererSpecs);

      spyOn(persona, 'registerDependencies_');
      spyOn(persona, 'registerCustomElement_');

      persona['register_'](injector, mockTemplates, ctrl);
      assert(persona['registerCustomElement_']).to.haveBeenCalledWith(spec, customElementClass);
      assert(persona['createCustomElementClass_']).to.haveBeenCalledWith(
          HTMLElement,
          templateContent,
          injector,
          ctrl,
          tag,
          inputProviders,
          listenerSpecs,
          rendererSpecs,
          undefined);
      assert(persona['registerListeners_']).to.haveBeenCalledWith(ctrl);
      assert(persona['registerRenderers_']).to.haveBeenCalledWith(ctrl);
      assert(persona['registerInputs_']).to.haveBeenCalledWith(spec);
      assert(persona['registerDependencies_']).to.haveBeenCalledWith(spec, injector, mockTemplates);
      assert(mockTemplates.getTemplate).to.haveBeenCalledWith(templateKey);
    });

    it(`should throw error if the template string cannot be found`, () => {
      const injector = Mocks.object('injector');
      const ctrl = Mocks.object('ctrl');
      const tag = 'tag';
      const spec = {
        tag,
        templateKey: 'templateKey',
      };
      persona['componentSpecs_'].set(ctrl, spec);

      const mockTemplates = jasmine.createSpyObj('Templates', ['getTemplate']);

      assert(() => {
        persona['register_'](injector, mockTemplates, ctrl);
      }).to.throwError(/No templates found/);
    });

    it(`should do nothing if the spec cannot be found`, () => {
      const injector = Mocks.object('injector');
      const ctrl = Mocks.object('ctrl');
      const mockTemplates = jasmine.createSpyObj('Templates', ['getTemplate']);

      persona['register_'](injector, mockTemplates, ctrl);
      assert(mockCustomElements.define).toNot.haveBeenCalled();
    });

    it(`should do nothing if the ctrl is already registered`, () => {
      const injector = Mocks.object('injector');
      const ctrl = Mocks.object('ctrl');
      const mockTemplates = jasmine.createSpyObj('Templates', ['getTemplate']);
      persona['registeredSpecs_'].add(ctrl);

      const spec = {
        tag: 'tag',
        templateKey: 'templateKey',
      };
      persona['componentSpecs_'].set(ctrl, spec);

      persona['register_'](injector, mockTemplates, ctrl);
      assert(mockCustomElements.define).toNot.haveBeenCalled();
    });
  });

  describe('registerAll', () => {
    it(`should register all components correctly`, () => {
      const injector = Mocks.object('injector');
      const ctor1 = Mocks.object('ctor1');
      const ctor2 = Mocks.object('ctor2');
      const spec1 = Mocks.object('spec1');
      const spec2 = Mocks.object('spec2');
      persona['componentSpecs_'].set(ctor1, spec1);
      persona['componentSpecs_'].set(ctor2, spec2);

      spyOn(persona, 'register_');

      const templates = Mocks.object('templates');

      persona.registerAll(injector, templates);
      assert(persona['register_']).to.haveBeenCalledWith(injector, templates, ctor1);
      assert(persona['register_']).to.haveBeenCalledWith(injector, templates, ctor2);
    });
  });

  describe('registerCustomElement_', () => {
    it(`should define the element correctly`, () => {
      class TestElement { }
      const tag = 'tag';
      const parentTag = 'parentTag';
      const spec = {tag, parent: {tag: parentTag}};

      persona['registerCustomElement_'](spec as any, TestElement);
      assert(mockCustomElements.define).to
          .haveBeenCalledWith(tag, TestElement, {extends: parentTag});
    });

    it(`should handle defining if therer are no parents`, () => {
      class TestElement { }
      const tag = 'tag';
      const spec = {tag};

      persona['registerCustomElement_'](spec as any, TestElement);
      assert(mockCustomElements.define).to .haveBeenCalledWith(tag, TestElement);
    });
  });

  describe('registerDependencies_', () => {
    it(`should register the dependencies correctly`, () => {
      const injector = Mocks.object('injector');
      const templates = Mocks.object('templates');
      const dependency1 = Mocks.object('dependency1');
      const dependency2 = Mocks.object('dependency2');
      const spec = {dependencies: [dependency1, dependency2]};

      spyOn(persona, 'register_');

      persona['registerDependencies_'](spec as any, injector, templates);
      assert(persona['register_']).to.haveBeenCalledWith(injector, templates, dependency1);
      assert(persona['register_']).to.haveBeenCalledWith(injector, templates, dependency2);
    });

    it(`should not throw errors if there are no dependencies`, () => {
      const injector = Mocks.object('injector');
      const templates = Mocks.object('templates');

      assert(() => {
        persona['registerDependencies_']({} as any, injector, templates);
      }).toNot.throw();
    });
  });

  describe('registerInputs_', () => {
    it(`should register the inputs correctly`, () => {
      const id1 = instanceId('id1', NumberType);
      const defaultValue1 = Mocks.object('defaultValue1');
      const mockSelector1 = jasmine.createSpyObj('Selector1', ['getDefaultValue', 'getId']);
      mockSelector1.getDefaultValue.and.returnValue(defaultValue1);
      mockSelector1.getId.and.returnValue(id1);

      const id2 = instanceId('id2', NumberType);
      const defaultValue2 = Mocks.object('defaultValue2');
      const mockSelector2 = jasmine.createSpyObj('Selector2', ['getDefaultValue', 'getId']);
      mockSelector2.getDefaultValue.and.returnValue(defaultValue2);
      mockSelector2.getId.and.returnValue(id2);

      const provider1 = Mocks.object('provider1');
      const provider2 = Mocks.object('provider2');
      Fakes.build(spyOn(Graph, 'createProvider'))
          .when(id1, defaultValue1).return(provider1)
          .when(id2, defaultValue2).return(provider2);

      const existingSelector = Mocks.object('existingSelector');
      const existingProvider = Mocks.object('existingProvider');
      persona['inputProviders_'].set(existingSelector, existingProvider);

      const spec = {
        inputs: [mockSelector1, mockSelector2],
      };
      assert(persona['registerInputs_'](spec as any)).to.haveEntries([
        [mockSelector1, provider1],
        [mockSelector2, provider2],
      ]);
      assert(persona['inputProviders_']).to.haveEntries([
        [existingSelector, existingProvider],
        [mockSelector1, provider1],
        [mockSelector2, provider2],
      ]);
      assert(Graph.createProvider).to.haveBeenCalledWith(id1, defaultValue1);
      assert(Graph.createProvider).to.haveBeenCalledWith(id2, defaultValue2);
    });

    it(`should not create provider for inputs that already have one`, () => {
      const existingSelector = Mocks.object('existingSelector');
      const existingProvider = Mocks.object('existingProvider');
      persona['inputProviders_'].set(existingSelector, existingProvider);

      spyOn(Graph, 'createProvider');

      const spec = {
        inputs: [existingSelector],
      };
      assert(persona['registerInputs_'](spec as any)).to.haveEntries([
        [existingSelector, existingProvider],
      ]);
      assert(persona['inputProviders_']).to.haveEntries([
        [existingSelector, existingProvider],
      ]);
      assert(Graph.createProvider).toNot.haveBeenCalled();
    });

    it(`should not throw errors if there are no inputs`, () => {
      assert(persona['registerInputs_']({} as any)).to.haveEntries([]);
    });
  });

  describe('registerListeners_', () => {
    it(`should get the correct specs`, () => {
      const ctrl = Mocks.object('ctrl');
      const ancestorSpecs = Mocks.object('ancestorSpecs');
      spyOn(persona, 'getAncestorSpecs_').and.returnValue(ancestorSpecs);

      assert(persona['registerListeners_'](ctrl)).to.equal(ancestorSpecs);
      assert(persona['getAncestorSpecs_']).to.haveBeenCalledWith(ctrl, persona['listenerSpecs_']);
    });
  });

  describe('registerRenderers_', () => {
    it(`should register the providers correctly`, () => {
      class TestClass extends BaseDisposable { }

      const key1 = 'key1';
      const parameter11 = Mocks.object('parameter11');
      const parameter12 = Mocks.object('parameter12');
      const id1 = instanceId('id1', NumberType);
      const mockSelector1 = jasmine.createSpyObj('Selector1', ['getId']);
      mockSelector1.getId.and.returnValue(id1);

      const key2 = 'key2';
      const parameter2 = Mocks.object('parameter2');
      const id2 = instanceId('id2', NumberType);
      const mockSelector2 = jasmine.createSpyObj('Selector2', ['getId']);
      mockSelector2.getId.and.returnValue(id2);

      const value1 = Mocks.object('value1');
      const value2 = Mocks.object('value2');
      TestClass.prototype[key1] = value1;
      TestClass.prototype[key2] = value2;

      const rendererSpecs = new Map([
        [key1, {parameters: [parameter11, parameter12], selector: mockSelector1}],
        [key2, {parameters: [parameter2], selector: mockSelector2}],
      ]);
      spyOn(persona, 'getAncestorSpecs_').and.returnValue(rendererSpecs);

      spyOn(Graph, 'registerGenericProvider_');

      assert(persona['registerRenderers_'](TestClass)).to.equal(rendererSpecs);
      assert(Graph['registerGenericProvider_']).to
          .haveBeenCalledWith(id1, value1, parameter11, parameter12);
      assert(Graph['registerGenericProvider_']).to
          .haveBeenCalledWith(id2, value2, parameter2);
      assert(persona['getAncestorSpecs_']).to
          .haveBeenCalledWith(TestClass, persona['rendererSpecs_']);
    });
  });
});

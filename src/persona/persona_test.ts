import { assert, Fakes, Matchers, Mocks, TestBase } from '../test-base';
TestBase.setup();

import { BaseDisposable } from '../dispose';
import { Graph } from '../graph';
import { InstanceId } from '../graph/instance-id';
import { ImmutableMap, ImmutableSet } from '../immutable';
import { CustomElement } from '../persona/custom-element';
import { PersonaImpl } from '../persona/persona';
import { Selector } from '../persona/selector';
import { __shadowRoot } from '../persona/shadow-root-symbol';

describe('CustomElement', () => {
  class TestCtrl extends BaseDisposable { }

  let mockInjector: any;
  let listenerSpecMap: Map<any, any>;
  let rendererSpecMap: Map<any, any>;
  let inputs: Selector<any>[];
  let element: CustomElement & HTMLElement;
  let persona: PersonaImpl;

  beforeEach(() => {
    mockInjector = jasmine.createSpyObj('Injector', ['instantiate']);
    const mockCustomElements = jasmine.createSpyObj('CustomElements', ['define']);
    const mockTemplates = jasmine.createSpyObj('Templates', ['getTemplate']);
    mockTemplates.getTemplate.and.returnValue('templateContent');

    persona = new PersonaImpl(mockCustomElements);
    rendererSpecMap = new Map();
    persona['rendererSpecs_'].set(TestCtrl, rendererSpecMap);

    listenerSpecMap = new Map();
    Fakes.build(spyOn(persona, 'getAncestorSpecs_'))
        .when(TestCtrl, persona['rendererSpecs_']).return(rendererSpecMap)
        .when(TestCtrl, persona['listenerSpecs_']).return(listenerSpecMap);

    inputs = [];
    persona['componentSpecs_'].set(TestCtrl, {inputs} as any);

    persona['register_'](mockInjector, mockTemplates, TestCtrl);
    const elementCtor = mockCustomElements.define.calls.argsFor(0)[1];

    // Customized native HTML Element isn't supported yet, so we use a mock.
    element = Mocks.object('element');
    Object.setPrototypeOf(element, elementCtor.prototype);
  });

  describe('connectedCallback', () => {
    it(`should instantiate the ctrl correctly`, () => {
      const mockCtrl = jasmine.createSpyObj('Ctrl', ['addDisposable']);
      mockInjector.instantiate.and.returnValue(mockCtrl);

      const graphOnSpy = spyOn(Graph, 'on');
      spyOn(element, 'onGraphReady_');

      const id1 = Mocks.object('id1');
      const mockSelector1 = jasmine.createSpyObj('Selector1', ['getId']);
      mockSelector1.getId.and.returnValue(id1);

      const id2 = Mocks.object('id2');
      const mockSelector2 = jasmine.createSpyObj('Selector2', ['getId']);
      mockSelector2.getId.and.returnValue(id2);

      rendererSpecMap.set('key1', {selector: mockSelector1});
      rendererSpecMap.set('key2', {selector: mockSelector2});

      const mockListener11 = jasmine.createSpyObj('Listener11', ['start']);
      const handler11 = Mocks.object('handler11');
      const useCapture11 = true;

      const mockListener12 = jasmine.createSpyObj('Listener12', ['start']);
      const handler12 = Mocks.object('handler12');
      const useCapture12 = true;
      listenerSpecMap.set(
          'listenerKey1',
          ImmutableSet.of([
            {handler: handler11, listener: mockListener11, useCapture: useCapture11},
            {handler: handler12, listener: mockListener12, useCapture: useCapture12},
          ]));

      const mockListener2 = jasmine.createSpyObj('Listener2', ['start']);
      const handler2 = Mocks.object('handler2');
      const useCapture2 = false;
      listenerSpecMap.set(
          'listenerKey2',
          ImmutableSet.of([
            {handler: handler2, listener: mockListener2, useCapture: useCapture2},
          ]));

      const shadowRoot = Mocks.object('shadowRoot');
      spyOn(element, 'getShadowRoot_').and.returnValue(shadowRoot);
      spyOn(element, 'updateElement_');
      spyOn(element, 'dispatch_');
      spyOn(persona, 'updateValue');

      const input1 = Mocks.object('input1');
      const input2 = Mocks.object('input2');
      inputs.push(input1, input2);

      element.connectedCallback();
      assert(element['dispatch_']).to.haveBeenCalledWith('gs-create', shadowRoot);

      assert(persona.updateValue).to.haveBeenCalledWith(input1, mockCtrl);
      assert(persona.updateValue).to.haveBeenCalledWith(input2, mockCtrl);

      assert(mockListener11.start).to
          .haveBeenCalledWith(shadowRoot, handler11, mockCtrl, useCapture11);
      assert(mockListener12.start).to
          .haveBeenCalledWith(shadowRoot, handler12, mockCtrl, useCapture12);
      assert(mockListener2.start).to
          .haveBeenCalledWith(shadowRoot, handler2, mockCtrl, useCapture2);

      assert(element['updateElement_']).to.haveBeenCalledWith(mockSelector1);
      assert(element['updateElement_']).to.haveBeenCalledWith(mockSelector2);

      assert(Graph.on).to.haveBeenCalledWith('ready', Matchers.anyFunction(), element);

      const graphEvent = Mocks.object('graphEvent');
      graphOnSpy.calls.argsFor(0)[1](graphEvent);
      assert(element['onGraphReady_']).to
          .haveBeenCalledWith(Matchers.any(ImmutableMap), graphEvent);

      assert(element['onGraphReady_'].calls.argsFor(0)[0] as ImmutableMap<any, any>).to
          .haveElements([
            [id1, mockSelector1],
            [id2, mockSelector2],
          ]);
      assert(mockCtrl[__shadowRoot]).to.equal(shadowRoot);
      assert(mockInjector.instantiate).to.haveBeenCalledWith(TestCtrl);
      assert(element.getCtrl()).to.equal(mockCtrl);
    });
  });

  describe('disconnectedCallback', () => {
    it(`should dispose the ctrl`, () => {
      const mockCtrl = jasmine.createSpyObj('Ctrl', ['dispose']);
      element['ctrl_'] = mockCtrl;

      element.disconnectedCallback();
      assert(mockCtrl.dispose).to.haveBeenCalledWith();
      assert(element['ctrl_']).to.beNull();
    });

    it(`should not throw errors if the ctrl does not exist`, () => {
      assert(() => {
        element.disconnectedCallback();
      }).toNot.throw();
    });
  });

  describe('onGraphReady_', () => {
    it(`should update the element correctly`, () => {
      const id = Mocks.object('id');
      Object.setPrototypeOf(id, InstanceId.prototype);

      const selector = Mocks.object('selector');
      const map = new Map([[id, selector]]);
      const context = Mocks.object('context');
      element['ctrl_'] = context;

      spyOn(element, 'updateElement_');

      element['onGraphReady_'](map, {id, context});
      assert(element['updateElement_']).to.haveBeenCalledWith(selector);
    });

    it(`should do nothing if there are no corresponding selectors`, () => {
      const id = Mocks.object('id');
      Object.setPrototypeOf(id, InstanceId.prototype);

      const map = new Map();
      const context = Mocks.object('context');
      element['ctrl_'] = context;

      spyOn(element, 'updateElement_');

      element['onGraphReady_'](map, {id, context});
      assert(element['updateElement_']).toNot.haveBeenCalled();
    });

    it(`should do nothing if the event context is not the ctrl`, () => {
      const id = Mocks.object('id');
      Object.setPrototypeOf(id, InstanceId.prototype);

      const selector = Mocks.object('selector');
      const map = new Map([[id, selector]]);
      const context = Mocks.object('context');
      element['ctrl_'] = context;

      spyOn(element, 'updateElement_');

      element['onGraphReady_'](map, {id, context: Mocks.object('otherContext')});
      assert(element['updateElement_']).toNot.haveBeenCalled();
    });

    it(`should do nothing if the id isn't InstanceId`, () => {
      const id = Mocks.object('id');

      const selector = Mocks.object('selector');
      const map = new Map([[id, selector]]);
      const context = Mocks.object('context');
      element['ctrl_'] = context;

      spyOn(element, 'updateElement_');

      element['onGraphReady_'](map, {id, context});
      assert(element['updateElement_']).toNot.haveBeenCalled();
    });
  });

  describe('updateElement_', () => {
    it(`should update the selector correctly`, async () => {
      const id = Mocks.object('id');
      const mockSelector = jasmine.createSpyObj('Selector', ['getId', 'setValue']);
      mockSelector.getId.and.returnValue(id);

      const value = Mocks.object('value');
      spyOn(Graph, 'get').and.returnValue(Promise.resolve(value));

      const shadowRoot = Mocks.object('shadowRoot');
      spyOn(element, 'getShadowRoot_').and.returnValue(shadowRoot);

      const ctrl = Mocks.object('ctrl');
      element['ctrl_'] = ctrl;

      const timestamp = Mocks.object('timestamp');
      spyOn(Graph, 'getTimestamp').and.returnValue(timestamp);

      await element['updateElement_'](mockSelector);
      assert(mockSelector.setValue).to.haveBeenCalledWith(value, shadowRoot, timestamp);
      assert(Graph.get).to.haveBeenCalledWith(id, timestamp, ctrl);
    });
  });
});


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

  describe('register_', () => {
    it(`should register the dependencies and the custom element correctly`, () => {
      const injector = Mocks.object('injector');

      const id1 = Mocks.object('id1');
      const mockSelector1 = jasmine.createSpyObj('Selector1', ['getId']);
      mockSelector1.getId.and.returnValue(id1);

      const key1 = 'key1';
      const fn1 = Mocks.object('fn1');
      const param11 = Mocks.object('param11');
      const param12 = Mocks.object('param12');

      const id2 = Mocks.object('id2');
      const mockSelector2 = jasmine.createSpyObj('Selector2', ['getId']);
      mockSelector2.getId.and.returnValue(id2);

      const key2 = 'key2';
      const fn2 = Mocks.object('fn2');

      const ctrl = Mocks.object('ctrl');
      ctrl.prototype = {[key1]: fn1, [key2]: fn2};

      const rendererSpecs = new Map([
        [key1, {parameters: [param11, param12], selector: mockSelector1}],
        [key2, {parameters: [], selector: mockSelector2}],
      ]);

      const listenerSpecs = Mocks.object('listenerSpecs');
      Fakes.build(spyOn(persona, 'getAncestorSpecs_'))
          .when(ctrl, persona['rendererSpecs_']).return(rendererSpecs)
          .when(ctrl, persona['listenerSpecs_']).return(listenerSpecs);

      const dependencyCtor1 = Mocks.object('dependencyCtor1');
      const dependencyCtor2 = Mocks.object('dependencyCtor2');
      const parentCtor = HTMLDivElement;
      const parentTag = 'div' as 'div';
      const tag = 'tag';

      const dependencySpec = Mocks.object('dependencySpec');
      const templateContent = 'templateContent';
      const mockTemplates = jasmine.createSpyObj('Templates', ['getTemplate']);
      mockTemplates.getTemplate.and.returnValue(templateContent);

      const origRegister = persona['register_'].bind(persona);
      Fakes.build(spyOn(persona, 'register_'))
          .when(injector, mockTemplates, ctrl, dependencySpec).return()
          .else().call(origRegister);

      spyOn(Graph, 'registerGenericProvider_');

      const customElementClass = Mocks.object('customElementClass');
      spyOn(persona, 'createCustomElementClass_').and.returnValue(customElementClass);

      const input1 = Mocks.object('input1');
      const defaultValue1 = Mocks.object('defaultValue1');
      const inputProvider1 = Mocks.object('inputProvider1');
      const mockInputSelector1 = jasmine.createSpyObj(
          'InputSelector1',
          ['getDefaultValue', 'getId', 'getProvider']);
      mockInputSelector1.getDefaultValue.and.returnValue(defaultValue1);
      mockInputSelector1.getId.and.returnValue(input1);

      const input2 = Mocks.object('input2');
      const defaultValue2 = Mocks.object('defaultValue2');
      const inputProvider2 = Mocks.object('inputProvider2');
      const mockInputSelector2 = jasmine.createSpyObj(
          'InputSelector2',
          ['getDefaultValue', 'getId', 'getProvider']);
      mockInputSelector2.getDefaultValue.and.returnValue(defaultValue2);
      mockInputSelector2.getId.and.returnValue(input2);

      Fakes.build(spyOn(Graph, 'createProvider'))
          .when(input1).return(inputProvider1)
          .when(input2).return(inputProvider2);

      const spec = {
        dependencies: [dependencyCtor1, dependencyCtor2],
        inputs: [mockInputSelector1, mockInputSelector2],
        parent: {
          class: parentCtor,
          tag: parentTag,
        },
        tag,
        templateKey: 'templateKey',
      };
      persona['componentSpecs_'].set(ctrl, spec);

      persona['register_'](injector, mockTemplates, ctrl);
      assert(mockCustomElements.define).to
          .haveBeenCalledWith(tag, customElementClass, {extends: parentTag});
      assert(persona['createCustomElementClass_']).to.haveBeenCalledWith(
          parentCtor,
          templateContent,
          injector,
          ctrl,
          tag,
          [mockInputSelector1, mockInputSelector2],
          listenerSpecs,
          rendererSpecs);

      assert(Graph.registerGenericProvider_).to
          .haveBeenCalledWith(id1, fn1, param11, param12);
      assert(Graph.registerGenericProvider_).to.haveBeenCalledWith(id2, fn2);

      assert(persona['inputProviders_']).to.haveEntries([
        [mockInputSelector1, inputProvider1],
        [mockInputSelector2, inputProvider2],
      ]);
      assert(Graph.createProvider).to.haveBeenCalledWith(input1, defaultValue1);
      assert(Graph.createProvider).to.haveBeenCalledWith(input2, defaultValue2);

      assert(persona['register_']).to.haveBeenCalledWith(injector, mockTemplates, dependencyCtor1);
      assert(persona['register_']).to.haveBeenCalledWith(injector, mockTemplates, dependencyCtor2);
    });

    it(`should register with HTMLElement if the spec has no parents`, () => {
      const injector = Mocks.object('injector');

      const id = Mocks.object('id');
      const mockSelector = jasmine.createSpyObj('Selector', ['getId']);
      mockSelector.getId.and.returnValue(id);

      const key = 'key';
      const fn = Mocks.object('fn');
      const param = Mocks.object('param');

      const ctrl = Mocks.object('ctrl');
      ctrl.prototype = {[key]: fn};

      const rendererSpecs = new Map([
        [key, {parameters: [param], selector: mockSelector}],
      ]);
      const listenerSpecs = Mocks.object('listenerSpecs');
      Fakes.build(spyOn(persona, 'getAncestorSpecs_'))
          .when(ctrl, persona['rendererSpecs_']).return(rendererSpecs)
          .when(ctrl, persona['listenerSpecs_']).return(listenerSpecs);

      const dependencyCtor = Mocks.object('dependencyCtor');
      const tag = 'tag';

      const dependencySpec = Mocks.object('dependencySpec');
      const templateContent = 'templateContent';
      const mockTemplates = jasmine.createSpyObj('Templates', ['getTemplate']);
      mockTemplates.getTemplate.and.returnValue(templateContent);

      const origRegister = persona['register_'].bind(persona);
      Fakes.build(spyOn(persona, 'register_'))
          .when(injector, mockTemplates, ctrl, dependencySpec).return()
          .else().call(origRegister);

      spyOn(Graph, 'registerGenericProvider_');

      const customElementClass = Mocks.object('customElementClass');
      spyOn(persona, 'createCustomElementClass_').and.returnValue(customElementClass);

      const input = Mocks.object('input1');
      const inputProvider = Mocks.object('inputProvider');
      const defaultValue = Mocks.object('defaultValue');
      const mockInputSelector = jasmine.createSpyObj(
          'InputSelector',
          ['getDefaultValue', 'getId', 'getProvider']);
      mockInputSelector.getDefaultValue.and.returnValue(defaultValue);
      mockInputSelector.getId.and.returnValue(input);
      spyOn(Graph, 'createProvider').and.returnValue(inputProvider);

      const spec = {
        dependencies: [dependencyCtor],
        inputs: [mockInputSelector],
        tag,
        templateKey: 'templateKey',
      };
      persona['componentSpecs_'].set(ctrl, spec);

      persona['register_'](injector, mockTemplates, ctrl);
      assert(mockCustomElements.define).to
          .haveBeenCalledWith(tag, customElementClass);
      assert(persona['createCustomElementClass_']).to.haveBeenCalledWith(
          HTMLElement,
          templateContent,
          injector,
          ctrl,
          tag,
          [mockInputSelector],
          listenerSpecs,
          rendererSpecs);

      assert(Graph.registerGenericProvider_).to.haveBeenCalledWith(id, fn, param);
      assert(Graph.createProvider).to.haveBeenCalledWith(input, defaultValue);
      assert(persona['register_']).to.haveBeenCalledWith(injector, mockTemplates, dependencyCtor);
    });

    it(`should skip inputs that are already registered`, () => {
      const injector = Mocks.object('injector');

      const ctrl = Mocks.object('ctrl');
      ctrl.prototype = {};

      spyOn(persona, 'getAncestorSpecs_').and.returnValue([]);

      const parentCtor = HTMLDivElement;
      const parentTag = 'div' as 'div';
      const tag = 'tag';

      const templateContent = 'templateContent';
      const mockTemplates = jasmine.createSpyObj('Templates', ['getTemplate']);
      mockTemplates.getTemplate.and.returnValue(templateContent);

      spyOn(Graph, 'registerGenericProvider_');

      const customElementClass = Mocks.object('customElementClass');
      spyOn(persona, 'createCustomElementClass_').and.returnValue(customElementClass);

      const input = Mocks.object('input');
      const mockInputSelector = jasmine.createSpyObj(
          'InputSelector',
          ['getDefaultValue', 'getId', 'getProvider']);
      mockInputSelector.getId.and.returnValue(input);

      const spec = {
        inputs: [mockInputSelector],
        parent: {
          class: parentCtor,
          tag: parentTag,
        },
        tag,
        templateKey: 'templateKey',
      };
      persona['componentSpecs_'].set(ctrl, spec);

      spyOn(Graph, 'isRegistered').and.returnValue(true);
      spyOn(Graph, 'createProvider');

      persona['register_'](injector, mockTemplates, ctrl);
      assert(mockCustomElements.define).to
          .haveBeenCalledWith(tag, customElementClass, {extends: parentTag});
      assert(persona['createCustomElementClass_']).to.haveBeenCalledWith(
          parentCtor,
          templateContent,
          injector,
          ctrl,
          tag,
          [mockInputSelector],
          [],
          []);

      assert(persona['inputProviders_']).to.haveEntries([]);
      assert(Graph.createProvider).toNot.haveBeenCalled();
      assert(Graph.isRegistered).to.haveBeenCalledWith(input);
    });

    it(`should not throw errors if there are no inputs`, () => {
      const injector = Mocks.object('injector');

      const ctrl = Mocks.object('ctrl');
      const dependencyCtor = Mocks.object('dependencyCtor');
      const tag = 'tag';

      const dependencySpec = Mocks.object('dependencySpec');
      const templateContent = 'templateContent';
      const mockTemplates = jasmine.createSpyObj('Templates', ['getTemplate']);
      mockTemplates.getTemplate.and.returnValue(templateContent);

      const origRegister = persona['register_'].bind(persona);
      Fakes.build(spyOn(persona, 'register_'))
          .when(injector, mockTemplates, ctrl, dependencySpec).return()
          .else().call(origRegister);

      spyOn(Graph, 'registerGenericProvider_');

      const rendererSpecs = ImmutableMap.of<any, any>([]);
      const listenerSpecs = ImmutableMap.of<any, any>([]);
      Fakes.build(spyOn(persona, 'getAncestorSpecs_'))
          .when(ctrl, persona['rendererSpecs_']).return(rendererSpecs)
          .when(ctrl, persona['listenerSpecs_']).return(listenerSpecs);

      const customElementClass = Mocks.object('customElementClass');
      spyOn(persona, 'createCustomElementClass_').and.returnValue(customElementClass);

      const spec = {
        dependencies: [dependencyCtor],
        tag,
        templateKey: 'templateKey',
      };
      persona['componentSpecs_'].set(ctrl, spec);

      persona['register_'](injector, mockTemplates, ctrl);
      assert(mockCustomElements.define).to
          .haveBeenCalledWith(tag, customElementClass);
      assert(persona['createCustomElementClass_']).to.haveBeenCalledWith(
          HTMLElement,
          templateContent,
          injector,
          ctrl,
          tag,
          [],
          listenerSpecs,
          rendererSpecs);

      assert(persona['register_']).to.haveBeenCalledWith(injector, mockTemplates, dependencyCtor);
    });

    it(`should not throw errors if there are no dependencies`, () => {
      const injector = Mocks.object('injector');

      const ctrl = Mocks.object('ctrl');
      const tag = 'tag';
      const spec = {
        tag,
        templateKey: 'templateKey',
      };
      persona['componentSpecs_'].set(ctrl, spec);

      const templateContent = 'templateContent';
      const mockTemplates = jasmine.createSpyObj('Templates', ['getTemplate']);
      mockTemplates.getTemplate.and.returnValue(templateContent);

      const customElementClass = Mocks.object('customElementClass');
      spyOn(persona, 'createCustomElementClass_').and.returnValue(customElementClass);

      const rendererSpecs = ImmutableMap.of<any, any>([]);
      const listenerSpecs = ImmutableMap.of<any, any>([]);
      Fakes.build(spyOn(persona, 'getAncestorSpecs_'))
          .when(ctrl, persona['rendererSpecs_']).return(rendererSpecs)
          .when(ctrl, persona['listenerSpecs_']).return(listenerSpecs);

      persona['register_'](injector, mockTemplates, ctrl);
      assert(mockCustomElements.define).to
          .haveBeenCalledWith(tag, customElementClass);
      assert(persona['createCustomElementClass_']).to.haveBeenCalledWith(
          HTMLElement,
          templateContent,
          injector,
          ctrl,
          tag,
          [],
          listenerSpecs,
          rendererSpecs);
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

  describe('updateValue', () => {
    it(`should update the correct provider`, async () => {
      const value = 123;
      const mockSelector = jasmine.createSpyObj('Selector', ['getValue']);
      mockSelector.getValue.and.returnValue(Promise.resolve(value));

      const ctrl = Mocks.object('ctrl');
      const mockProvider = jasmine.createSpy('Provider');
      persona['inputProviders_'].set(mockSelector, mockProvider);

      const shadowRoot = Mocks.object('shadowRoot');
      spyOn(persona, 'getShadowRoot').and.returnValue(shadowRoot);

      await persona.updateValue(mockSelector, ctrl);
      assert(mockProvider).to.haveBeenCalledWith(value, ctrl);
      assert(mockSelector.getValue).to.haveBeenCalledWith(shadowRoot);
      assert(persona.getShadowRoot).to.haveBeenCalledWith(ctrl);
    });

    it(`should reject if the provider does not exist`, async () => {
      const mockSelector = jasmine.createSpyObj('Selector', ['getValue']);
      const ctrl = Mocks.object('ctrl');
      const shadowRoot = Mocks.object('shadowRoot');
      spyOn(persona, 'getShadowRoot').and.returnValue(shadowRoot);

      await assert(persona.updateValue(mockSelector, ctrl)).to.rejectWithError(/to exist/);
    });

    it(`should throw error if shadow root cannot be found`, async () => {
      const mockSelector = jasmine.createSpyObj('Selector', ['getValue']);
      const ctrl = Mocks.object('ctrl');

      spyOn(persona, 'getShadowRoot').and.returnValue(null);

      await assert(persona.updateValue(mockSelector, ctrl)).to.rejectWithError(/be a controller/);
    });
  });
});

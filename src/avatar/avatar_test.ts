import { assert, Fakes, Matchers, Mocks, TestBase } from '../test-base';
TestBase.setup();

import { ImmutableMap } from 'src/immutable';
import { AvatarImpl } from '../avatar/avatar';
import { CustomElement } from '../avatar/custom-element';
import { BaseDisposable } from '../dispose';
import { Graph } from '../graph';
import { InstanceId } from '../graph/instance-id';

describe('CustomElement', () => {
  class TestCtrl extends BaseDisposable { }

  let mockInjector: any;
  let rendererSpecMap: Map<any, any>;
  let element: CustomElement & HTMLElement;

  beforeEach(() => {
    mockInjector = jasmine.createSpyObj('Injector', ['instantiate']);
    const mockCustomElements = jasmine.createSpyObj('CustomElements', ['define']);
    const mockTemplates = jasmine.createSpyObj('Templates', ['getTemplate']);
    mockTemplates.getTemplate.and.returnValue('templateContent');

    const avatar = new AvatarImpl(mockCustomElements);
    rendererSpecMap = new Map();
    avatar['rendererSpecs_'].set(TestCtrl, rendererSpecMap);

    avatar['componentSpecs_'].set(TestCtrl, Mocks.object('spec'));

    avatar['register_'](mockInjector, mockTemplates, TestCtrl);
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
      spyOn(element, 'onGraphChange_');

      const id1 = Mocks.object('id1');
      const mockSelector1 = jasmine.createSpyObj('Selector1', ['getId']);
      mockSelector1.getId.and.returnValue(id1);

      const id2 = Mocks.object('id2');
      const mockSelector2 = jasmine.createSpyObj('Selector2', ['getId']);
      mockSelector2.getId.and.returnValue(id2);

      rendererSpecMap.set('key1', {selector: mockSelector1});
      rendererSpecMap.set('key2', {selector: mockSelector2});

      spyOn(element, 'updateElement_');

      element.connectedCallback();
      assert(element['updateElement_']).to.haveBeenCalledWith(mockSelector1);
      assert(element['updateElement_']).to.haveBeenCalledWith(mockSelector2);

      assert(Graph.on).to.haveBeenCalledWith('change', Matchers.any(Function) as any, element);

      const graphEvent = Mocks.object('graphEvent');
      graphOnSpy.calls.argsFor(0)[1](graphEvent);
      assert(element['onGraphChange_']).to
          .haveBeenCalledWith(Matchers.any(ImmutableMap), graphEvent);

      assert(element['onGraphChange_'].calls.argsFor(0)[0] as ImmutableMap<any, any>).to
          .haveElements([
            [id1, mockSelector1],
            [id2, mockSelector2],
          ]);
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
    });

    it(`should not throw errors if the ctrl does not exist`, () => {
      assert(() => {
        element.disconnectedCallback();
      }).toNot.throw();
    });
  });

  describe('onGraphChange_', () => {
    it(`should update the element correctly`, () => {
      const id = Mocks.object('id');
      Object.setPrototypeOf(id, InstanceId.prototype);

      const selector = Mocks.object('selector');
      const map = new Map([[id, selector]]);
      const context = Mocks.object('context');
      element['ctrl_'] = context;

      spyOn(element, 'updateElement_');

      element['onGraphChange_'](map, {id, context});
      assert(element['updateElement_']).to.haveBeenCalledWith(selector);
    });

    it(`should do nothing if there are no corresponding selectors`, () => {
      const id = Mocks.object('id');
      Object.setPrototypeOf(id, InstanceId.prototype);

      const map = new Map();
      const context = Mocks.object('context');
      element['ctrl_'] = context;

      spyOn(element, 'updateElement_');

      element['onGraphChange_'](map, {id, context});
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

      element['onGraphChange_'](map, {id, context: Mocks.object('otherContext')});
      assert(element['updateElement_']).toNot.haveBeenCalled();
    });

    it(`should do nothing if the id isn't InstanceId`, () => {
      const id = Mocks.object('id');

      const selector = Mocks.object('selector');
      const map = new Map([[id, selector]]);
      const context = Mocks.object('context');
      element['ctrl_'] = context;

      spyOn(element, 'updateElement_');

      element['onGraphChange_'](map, {id, context});
      assert(element['updateElement_']).toNot.haveBeenCalled();
    });
  });
});


describe('avatar.Avatar', () => {
  let mockCustomElements: any;
  let avatar: AvatarImpl;

  beforeEach(() => {
    mockCustomElements = jasmine.createSpyObj('CustomElements', ['define']);
    avatar = new AvatarImpl(mockCustomElements);
  });

  describe('define', () => {
    it(`should add the spec correctly`, () => {
      const ctrl = class extends BaseDisposable { };
      const spec = {
        tag: 'gs-test',
        templateKey: 'key',
      };

      avatar.define(ctrl, spec);
      assert(avatar['componentSpecs_']).to.haveEntries([[ctrl, spec]]);
    });

    it(`should throw error if the component is already registered`, () => {
      const ctrl = class extends BaseDisposable { };
      const spec = {
        tag: 'gs-test',
        templateKey: 'key',
      };
      avatar['componentSpecs_'].set(ctrl, spec);

      assert(() => {
        avatar.define(ctrl, spec);
      }).to.throwError(/is already registered/);
    });
  });

  describe('defineRenderer', () => {
    it(`should add the spec correctly`, () => {
      const ctrl = Mocks.object('ctrl');
      const propertyKey = 'propertyKey';
      const selector = Mocks.object('selector');
      const parameter1 = Mocks.object('parameter1');
      const parameter2 = Mocks.object('parameter2');

      avatar.defineRenderer(ctrl, propertyKey, selector, parameter1, parameter2);
      assert(avatar['rendererSpecs_'].get(ctrl)!).to
          .haveEntries([[propertyKey, {parameters: [parameter1, parameter2], selector}]]);
    });

    it(`should add the spec to an existing property map correctly`, () => {
      const ctrl = Mocks.object('ctrl');
      const propertyKey = 'propertyKey';
      const selector = Mocks.object('selector');

      const otherPropertyKey = 'otherPropertyKey';
      const otherSpec = Mocks.object('otherSpec');
      avatar['rendererSpecs_'].set(ctrl, new Map([[otherPropertyKey, otherSpec]]));

      avatar.defineRenderer(ctrl, propertyKey, selector);
      assert(avatar['rendererSpecs_'].get(ctrl)!).to.haveEntries([
        [otherPropertyKey, otherSpec],
        [propertyKey, {parameters: [], selector}],
      ]);
    });

    it(`should error if the property has been registered`, () => {
      const ctrl = Mocks.object('ctrl');
      const propertyKey = 'propertyKey';
      const selector = Mocks.object('selector');

      const otherSpec = Mocks.object('otherSpec');
      avatar['rendererSpecs_'].set(ctrl, new Map([[propertyKey, otherSpec]]));

      assert(() => {
        avatar.defineRenderer(ctrl, propertyKey, selector);
      }).to.throwError(/is already registered/);
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
      avatar['rendererSpecs_'].set(ctrl, rendererSpecs);

      const dependencyCtor1 = Mocks.object('dependencyCtor1');
      const dependencyCtor2 = Mocks.object('dependencyCtor2');
      const parentCtor = HTMLDivElement;
      const parentTag = 'div' as 'div';
      const tag = 'tag';
      const spec = {
        dependencies: [dependencyCtor1, dependencyCtor2],
        parent: {
          class: parentCtor,
          tag: parentTag,
        },
        tag,
        templateKey: 'templateKey',
      };
      avatar['componentSpecs_'].set(ctrl, spec);

      const dependencySpec = Mocks.object('dependencySpec');
      const templateContent = 'templateContent';
      const mockTemplates = jasmine.createSpyObj('Templates', ['getTemplate']);
      mockTemplates.getTemplate.and.returnValue(templateContent);

      const origRegister = avatar['register_'].bind(avatar);
      Fakes.build(spyOn(avatar, 'register_'))
          .when(injector, mockTemplates, ctrl, dependencySpec).return()
          .else().call(origRegister);

      spyOn(Graph, 'registerGenericProvider_');

      const customElementClass = Mocks.object('customElementClass');
      spyOn(avatar, 'createCustomElementClass_').and.returnValue(customElementClass);

      avatar['register_'](injector, mockTemplates, ctrl);
      assert(mockCustomElements.define).to
          .haveBeenCalledWith(tag, customElementClass, {extends: parentTag});
      assert(avatar['createCustomElementClass_']).to.haveBeenCalledWith(
          parentCtor,
          templateContent,
          injector,
          ctrl,
          rendererSpecs);

      assert(Graph.registerGenericProvider_).to
          .haveBeenCalledWith(id1, true, fn1, param11, param12);
      assert(Graph.registerGenericProvider_).to.haveBeenCalledWith(id2, true, fn2);

      assert(avatar['register_']).to.haveBeenCalledWith(injector, mockTemplates, dependencyCtor1);
      assert(avatar['register_']).to.haveBeenCalledWith(injector, mockTemplates, dependencyCtor2);
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
      avatar['rendererSpecs_'].set(ctrl, rendererSpecs);

      const dependencyCtor = Mocks.object('dependencyCtor');
      const tag = 'tag';
      const spec = {
        dependencies: [dependencyCtor],
        tag,
        templateKey: 'templateKey',
      };
      avatar['componentSpecs_'].set(ctrl, spec);

      const dependencySpec = Mocks.object('dependencySpec');
      const templateContent = 'templateContent';
      const mockTemplates = jasmine.createSpyObj('Templates', ['getTemplate']);
      mockTemplates.getTemplate.and.returnValue(templateContent);

      const origRegister = avatar['register_'].bind(avatar);
      Fakes.build(spyOn(avatar, 'register_'))
          .when(injector, mockTemplates, ctrl, dependencySpec).return()
          .else().call(origRegister);

      spyOn(Graph, 'registerGenericProvider_');

      const customElementClass = Mocks.object('customElementClass');
      spyOn(avatar, 'createCustomElementClass_').and.returnValue(customElementClass);

      avatar['register_'](injector, mockTemplates, ctrl);
      assert(mockCustomElements.define).to
          .haveBeenCalledWith(tag, customElementClass);
      assert(avatar['createCustomElementClass_']).to.haveBeenCalledWith(
          HTMLElement,
          templateContent,
          injector,
          ctrl,
          rendererSpecs);

      assert(Graph.registerGenericProvider_).to.haveBeenCalledWith(id, true, fn, param);
      assert(avatar['register_']).to.haveBeenCalledWith(injector, mockTemplates, dependencyCtor);
    });

    it(`should not throw errors there are no renderers`, () => {
      const injector = Mocks.object('injector');

      const ctrl = Mocks.object('ctrl');
      const dependencyCtor = Mocks.object('dependencyCtor');
      const tag = 'tag';
      const spec = {
        dependencies: [dependencyCtor],
        tag,
        templateKey: 'templateKey',
      };
      avatar['componentSpecs_'].set(ctrl, spec);

      const dependencySpec = Mocks.object('dependencySpec');
      const templateContent = 'templateContent';
      const mockTemplates = jasmine.createSpyObj('Templates', ['getTemplate']);
      mockTemplates.getTemplate.and.returnValue(templateContent);

      const origRegister = avatar['register_'].bind(avatar);
      Fakes.build(spyOn(avatar, 'register_'))
          .when(injector, mockTemplates, ctrl, dependencySpec).return()
          .else().call(origRegister);

      spyOn(Graph, 'registerGenericProvider_');

      const customElementClass = Mocks.object('customElementClass');
      spyOn(avatar, 'createCustomElementClass_').and.returnValue(customElementClass);

      avatar['register_'](injector, mockTemplates, ctrl);
      assert(mockCustomElements.define).to
          .haveBeenCalledWith(tag, customElementClass);
      assert(avatar['createCustomElementClass_']).to.haveBeenCalledWith(
          HTMLElement,
          templateContent,
          injector,
          ctrl,
          new Map());

      assert(avatar['register_']).to.haveBeenCalledWith(injector, mockTemplates, dependencyCtor);
    });

    it(`should not throw errors if there are no dependencies`, () => {
      const injector = Mocks.object('injector');

      const ctrl = Mocks.object('ctrl');
      const tag = 'tag';
      const spec = {
        tag,
        templateKey: 'templateKey',
      };
      avatar['componentSpecs_'].set(ctrl, spec);

      const templateContent = 'templateContent';
      const mockTemplates = jasmine.createSpyObj('Templates', ['getTemplate']);
      mockTemplates.getTemplate.and.returnValue(templateContent);

      const customElementClass = Mocks.object('customElementClass');
      spyOn(avatar, 'createCustomElementClass_').and.returnValue(customElementClass);

      avatar['register_'](injector, mockTemplates, ctrl);
      assert(mockCustomElements.define).to
          .haveBeenCalledWith(tag, customElementClass);
      assert(avatar['createCustomElementClass_']).to.haveBeenCalledWith(
          HTMLElement,
          templateContent,
          injector,
          ctrl,
          new Map());
    });

    it(`should throw error if the template string cannot be found`, () => {
      const injector = Mocks.object('injector');
      const ctrl = Mocks.object('ctrl');
      const tag = 'tag';
      const spec = {
        tag,
        templateKey: 'templateKey',
      };
      avatar['componentSpecs_'].set(ctrl, spec);

      const mockTemplates = jasmine.createSpyObj('Templates', ['getTemplate']);

      assert(() => {
        avatar['register_'](injector, mockTemplates, ctrl);
      }).to.throwError(/No templates found/);
    });

    it(`should do nothing if the spec cannot be found`, () => {
      const injector = Mocks.object('injector');
      const ctrl = Mocks.object('ctrl');
      const mockTemplates = jasmine.createSpyObj('Templates', ['getTemplate']);

      avatar['register_'](injector, mockTemplates, ctrl);
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
      avatar['componentSpecs_'].set(ctor1, spec1);
      avatar['componentSpecs_'].set(ctor2, spec2);

      spyOn(avatar, 'register_');

      const templates = Mocks.object('templates');

      avatar.registerAll(injector, templates);
      assert(avatar['register_']).to.haveBeenCalledWith(injector, templates, ctor1);
      assert(avatar['register_']).to.haveBeenCalledWith(injector, templates, ctor2);
    });
  });
});

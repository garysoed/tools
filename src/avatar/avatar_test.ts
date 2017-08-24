import { assert, Fakes, Mocks, TestBase } from '../test-base';
TestBase.setup();

import { AvatarImpl } from '../avatar/avatar';
import { CustomElement } from '../avatar/custom-element';
import { BaseDisposable } from '../dispose';
import { Matchers } from '../jasmine';


describe('CustomElement', () => {
  class TestCtrl extends BaseDisposable { }

  let mockInjector: any;
  let element: CustomElement;

  beforeEach(() => {
    mockInjector = jasmine.createSpyObj('Injector', ['instantiate']);
    const mockCustomElements = jasmine.createSpyObj('CustomElements', ['define']);
    const avatar = new AvatarImpl(mockCustomElements);

    avatar['register_'](
        mockInjector,
        {
          ctrl: TestCtrl,
          tag: 'test',
          templateKey: 'templateKey',
        });
    const elementCtor = mockCustomElements.define.calls.argsFor(0)[1];

    // Customized native HTML Element isn't supported yet, so we use a mock.
    element = Mocks.object('element');
    Object.setPrototypeOf(element, elementCtor.prototype);
  });

  describe('connectedCallback', () => {
    it(`should instantiate the ctrl correctly`, () => {
      const ctrl = Mocks.object('ctrl');
      mockInjector.instantiate.and.returnValue(ctrl);

      element.connectedCallback();
      assert(element.getCtrl()).to.equal(ctrl);
      assert(mockInjector.instantiate).to.haveBeenCalledWith(TestCtrl);
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
        ctrl,
        tag: 'gs-test',
        templateKey: 'key',
      };

      avatar.define(spec);
      assert(avatar['componentSpecs_']).to.haveEntries([[ctrl, spec]]);
    });

    it(`should throw error if the component is already registered`, () => {
      const ctrl = class extends BaseDisposable { };
      const spec = {
        ctrl,
        tag: 'gs-test',
        templateKey: 'key',
      };

      avatar.define(spec);
      assert(avatar['componentSpecs_']).to.haveEntries([[ctrl, spec]]);
    });
  });

  describe('register_', () => {
    it(`should register the dependencies and the custom element correctly`, () => {
      const injector = Mocks.object('injector');
      const ctrl = Mocks.object('ctrl');
      const dependencyCtor1 = Mocks.object('dependencyCtor1');
      const dependencyCtor2 = Mocks.object('dependencyCtor2');
      const parentCtor = HTMLDivElement;
      const parentTag = 'div' as 'div';
      const tag = 'tag';
      const spec = {
        ctrl,
        dependencies: [dependencyCtor1, dependencyCtor2],
        parent: {
          class: parentCtor,
          tag: parentTag,
        },
        tag,
        templateKey: 'templateKey',
      };

      const dependencySpec = Mocks.object('dependencySpec');
      avatar['componentSpecs_'].set(dependencyCtor1, dependencySpec);

      const origRegister = avatar['register_'].bind(avatar);
      Fakes.build(spyOn(avatar, 'register_'))
          .when(injector, dependencySpec).return()
          .else().call(origRegister);

      avatar['register_'](injector, spec);
      assert(mockCustomElements.define).to
          .haveBeenCalledWith(tag, Matchers.anyThing(), {extends: parentTag});
      const ctor = mockCustomElements.define.calls.argsFor(0)[1];

      // Jasmine calls the parentCtor for some reason.
      assert(ctor.prototype instanceof parentCtor).to.beTrue();

      assert(avatar['register_']).to.haveBeenCalledWith(Matchers.anyThing(), dependencySpec);
    });

    it(`should register with HTMLElement if the spec has no parents`, () => {
      const injector = Mocks.object('injector');
      const ctrl = Mocks.object('ctrl');
      const tag = 'tag';
      const spec = {
        ctrl,
        tag,
        templateKey: 'templateKey',
      };

      avatar['register_'](injector, spec);
      assert(mockCustomElements.define).to.haveBeenCalledWith(tag, Matchers.anyThing());
      const ctor = mockCustomElements.define.calls.argsFor(0)[1];

      // Jasmine calls the parentCtor for some reason.
      assert(ctor.prototype instanceof HTMLElement).to.beTrue();
    });
  });

  describe('registerAll', () => {
    it(`should register all components correctly`, () => {
      const injector = Mocks.object('injector');
      const spec1 = Mocks.object('spec1');
      const spec2 = Mocks.object('spec2');
      avatar['componentSpecs_'].set(Mocks.object('ctor1'), spec1);
      avatar['componentSpecs_'].set(Mocks.object('ctor2'), spec2);

      spyOn(avatar, 'register_');

      avatar.registerAll(injector);
      assert(avatar['register_']).to.haveBeenCalledWith(injector, spec1);
      assert(avatar['register_']).to.haveBeenCalledWith(injector, spec2);
    });
  });
});

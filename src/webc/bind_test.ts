import {assert, TestBase} from '../test-base';
TestBase.setup();

import {ANNOTATIONS, Bind} from './bind';
import {AttributeBinder} from './attribute-binder';
import {Mocks} from '../mock/mocks';


describe('webc.Bind', () => {
  let bind: Bind;

  beforeEach(() => {
    bind = new Bind(true /* useShadow */);
  });

  describe('createBinder_', () => {
    it('should create the binder correctly when shadow and selector are used', () => {
      let targetEl = Mocks.object('targetEl');
      let mockShadowRoot = jasmine.createSpyObj('ShadowRoot', ['querySelector']);
      mockShadowRoot.querySelector.and.returnValue(targetEl);

      let selector = 'selector';
      let attributeName = 'attributeName';
      let element = Mocks.object('element');
      element.shadowRoot = mockShadowRoot;

      let binder = Mocks.object('binder');
      spyOn(AttributeBinder, 'of').and.returnValue(binder);

      bind['useShadow_'] = true;
      assert(bind['createBinder_'](element, selector, attributeName)).to.equal(binder);
      assert(AttributeBinder.of).to.haveBeenCalledWith(targetEl, attributeName);
      assert(mockShadowRoot.querySelector).to.haveBeenCalledWith(selector);
    });

    it('should create the binder correctly when shadow is not used but selector is', () => {
      let selector = 'selector';
      let attributeName = 'attributeName';
      let targetEl = Mocks.object('targetEl');
      let mockElement = jasmine.createSpyObj('Element', ['querySelector']);
      mockElement.querySelector.and.returnValue(targetEl);

      let binder = Mocks.object('binder');
      spyOn(AttributeBinder, 'of').and.returnValue(binder);

      bind['useShadow_'] = false;
      assert(bind['createBinder_'](mockElement, selector, attributeName)).to.equal(binder);
      assert(AttributeBinder.of).to.haveBeenCalledWith(targetEl, attributeName);
      assert(mockElement.querySelector).to.haveBeenCalledWith(selector);
    });

    it('should create the binder correctly when shadow is used but selector is not', () => {
      let attributeName = 'attributeName';
      let shadowRoot = Mocks.object('shadowRoot');
      let element = Mocks.object('element');
      element.shadowRoot = shadowRoot;

      let binder = Mocks.object('binder');
      spyOn(AttributeBinder, 'of').and.returnValue(binder);

      bind['useShadow_'] = true;
      assert(bind['createBinder_'](element, null, attributeName)).to.equal(binder);
      assert(AttributeBinder.of).to.haveBeenCalledWith(shadowRoot, attributeName);
    });

    it('should create the binder correctly when shadow and selector are not used', () => {
      let attributeName = 'attributeName';
      let element = Mocks.object('element');
      let binder = Mocks.object('binder');
      spyOn(AttributeBinder, 'of').and.returnValue(binder);

      bind['useShadow_'] = false;
      assert(bind['createBinder_'](element, null, attributeName)).to.equal(binder);
      assert(AttributeBinder.of).to.haveBeenCalledWith(element, attributeName);
    });
  });

  describe('attribute', () => {
    it('should attach the correct factory to the property', () => {
      let selector = 'selector';
      let attributeName = 'attributeName';
      let ctor = Mocks.object('ctor');
      let target = Mocks.object('target');
      target.constructor = ctor;

      let propertyKey = 'propertyKey';

      let mockAnnotationsHandler =
          jasmine.createSpyObj('AnnotationsHandler', ['attachValueToProperty']);
      spyOn(ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotationsHandler);

      let binder = Mocks.object('binder');
      spyOn(bind, 'createBinder_').and.returnValue(binder);

      bind.attribute(selector, attributeName)(target, propertyKey);
      assert(ANNOTATIONS.forCtor).to.haveBeenCalledWith(ctor);
      assert(mockAnnotationsHandler.attachValueToProperty).to.haveBeenCalledWith(
          propertyKey,
          jasmine.any(Function));

      let element = Mocks.object('element');
      assert(mockAnnotationsHandler.attachValueToProperty.calls.argsFor(0)[1](element))
          .to.equal(binder);
      assert(bind['createBinder_']).to.haveBeenCalledWith(element, selector, attributeName);
    });
  });
});

import {assert, TestBase} from '../test-base';
TestBase.setup();

import {ANNOTATIONS, Bind} from './bind';
import {AttributeBinder} from './attribute-binder';
import {Mocks} from '../mock/mocks';


describe('webc.Bind', () => {
  const SELECTOR = 'SELECTOR';
  let bind: Bind;

  beforeEach(() => {
    bind = new Bind(SELECTOR);
  });

  describe('createBinder_', () => {
    it('should create the binder correctly when selector is not null', () => {
      let targetEl = Mocks.object('targetEl');
      let mockShadowRoot = jasmine.createSpyObj('ShadowRoot', ['querySelector']);
      mockShadowRoot.querySelector.and.returnValue(targetEl);

      let selector = 'selector';
      let attributeName = 'attributeName';
      let element = Mocks.object('element');
      element.shadowRoot = mockShadowRoot;

      let binder = Mocks.object('binder');
      spyOn(AttributeBinder, 'of').and.returnValue(binder);

      bind['selector_'] = selector;
      assert(bind['createBinder_'](element, attributeName)).to.equal(binder);
      assert(AttributeBinder.of).to.haveBeenCalledWith(targetEl, attributeName);
      assert(mockShadowRoot.querySelector).to.haveBeenCalledWith(selector);
    });

    it('should create the binder correctly when the selector is null', () => {
      let attributeName = 'attributeName';
      let element = Mocks.object('element');

      let binder = Mocks.object('binder');
      spyOn(AttributeBinder, 'of').and.returnValue(binder);

      bind['selector_'] = null;
      assert(bind['createBinder_'](element, attributeName)).to.equal(binder);
      assert(AttributeBinder.of).to.haveBeenCalledWith(element, attributeName);
    });
  });

  describe('attribute', () => {
    it('should attach the correct factory to the property', () => {
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

      bind.attribute(attributeName)(target, propertyKey);
      assert(ANNOTATIONS.forCtor).to.haveBeenCalledWith(ctor);
      assert(mockAnnotationsHandler.attachValueToProperty).to.haveBeenCalledWith(
          propertyKey,
          jasmine.any(Function));

      let element = Mocks.object('element');
      assert(mockAnnotationsHandler.attachValueToProperty.calls.argsFor(0)[1](element))
          .to.equal(binder);
      assert(bind['createBinder_']).to.haveBeenCalledWith(element, attributeName);
    });
  });
});

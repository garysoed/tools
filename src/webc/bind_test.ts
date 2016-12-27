import {assert, Matchers, TestBase} from '../test-base';
TestBase.setup();

import {Mocks} from '../mock/mocks';

import {AttributeBinder} from './attribute-binder';
import {ANNOTATIONS, Bind} from './bind';
import {ChildrenElementsBinder} from './children-elements-binder';
import {ClassListBinder} from './class-list-binder';
import {ElementSwitchBinder} from './element-switch-binder';
import {PropertyBinder} from './property-binder';
import {Util} from './util';


describe('webc.Bind', () => {
  const SELECTOR = 'SELECTOR';
  let bind: Bind;

  beforeEach(() => {
    bind = new Bind(SELECTOR);
  });

  describe('createDecorator_', () => {
    it('should return the correct decorator', () => {
      let ctor = Mocks.object('ctor');
      let target = Mocks.object('target');
      target.constructor = ctor;

      let propertyKey = 'propertyKey';
      let binder = Mocks.object('binder');
      let mockBinderFactory = jasmine.createSpy('BinderFactory');
      mockBinderFactory.and.returnValue(binder);

      let targetEl = Mocks.object('targetEl');
      spyOn(Util, 'resolveSelector').and.returnValue(targetEl);

      let mockAnnotationHandler =
          jasmine.createSpyObj('AnnotationHandler', ['attachValueToProperty']);
      spyOn(ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotationHandler);

      let decorator = bind['createDecorator_'](mockBinderFactory);
      decorator(target, propertyKey);

      assert(mockAnnotationHandler.attachValueToProperty).to
          .haveBeenCalledWith(propertyKey, Matchers.any(Function));

      let parentEl = Mocks.object('parentEl');
      let instance = Mocks.object('instance');
      assert(mockAnnotationHandler.attachValueToProperty.calls.argsFor(0)[1](parentEl, instance))
          .to.equal(binder);

      assert(mockBinderFactory).to.haveBeenCalledWith(targetEl, instance);
      assert(Util.resolveSelector).to.haveBeenCalledWith(SELECTOR, parentEl);

      assert(ANNOTATIONS.forCtor).to.haveBeenCalledWith(ctor);
    });
  });

  describe('attribute', () => {
    it('should attach the correct factory to the property', () => {
      let attributeName = 'attributeName';
      let ctor = Mocks.object('ctor');
      let parser = Mocks.object('parser');
      let target = Mocks.object('target');
      target.constructor = ctor;

      let propertyKey = 'propertyKey';

      let mockAnnotationsHandler =
          jasmine.createSpyObj('AnnotationsHandler', ['attachValueToProperty']);
      spyOn(ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotationsHandler);

      let targetEl = Mocks.object('targetEl');
      spyOn(Util, 'resolveSelector').and.returnValue(targetEl);

      let binder = Mocks.object('binder');
      spyOn(AttributeBinder, 'of').and.returnValue(binder);

      bind.attribute(attributeName, parser)(target, propertyKey);
      assert(ANNOTATIONS.forCtor).to.haveBeenCalledWith(ctor);
      assert(mockAnnotationsHandler.attachValueToProperty).to.haveBeenCalledWith(
          propertyKey,
          jasmine.any(Function));

      let element = Mocks.object('element');
      let binderFactory = mockAnnotationsHandler.attachValueToProperty.calls.argsFor(0)[1];
      assert(binderFactory.call(bind, element)).to.equal(binder);
      assert(Util.resolveSelector).to.haveBeenCalledWith(SELECTOR, element);
      assert(AttributeBinder.of).to.haveBeenCalledWith(targetEl, attributeName, parser);
    });
  });

  describe('childrenElement', () => {
    it('should attach the correct factory to the property', () => {
      let elementGenerator = Mocks.object('elementGenerator');
      let dataSetter = Mocks.object('dataSetter');
      let ctor = Mocks.object('ctor');
      let target = Mocks.object('target');
      target.constructor = ctor;

      let propertyKey = 'propertyKey';

      let mockAnnotationsHandler =
          jasmine.createSpyObj('AnnotationsHandler', ['attachValueToProperty']);
      spyOn(ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotationsHandler);

      let targetEl = Mocks.object('targetEl');
      spyOn(Util, 'resolveSelector').and.returnValue(targetEl);

      let binder = Mocks.object('binder');
      spyOn(ChildrenElementsBinder, 'of').and.returnValue(binder);

      bind.childrenElements(elementGenerator, dataSetter)(target, propertyKey);
      assert(ANNOTATIONS.forCtor).to.haveBeenCalledWith(ctor);
      assert(mockAnnotationsHandler.attachValueToProperty).to.haveBeenCalledWith(
          propertyKey,
          jasmine.any(Function));

      let element = Mocks.object('element');
      let instance = Mocks.object('instance');
      assert(mockAnnotationsHandler.attachValueToProperty.calls.argsFor(0)[1](element, instance))
          .to.equal(binder);
      assert(Util.resolveSelector).to.haveBeenCalledWith(SELECTOR, element);
      assert(ChildrenElementsBinder.of).to
          .haveBeenCalledWith(targetEl, dataSetter, elementGenerator, instance);
    });
  });

  describe('classList', () => {
    it('should create the decorator correctly', () => {
      let binder = Mocks.object('binder');
      spyOn(ClassListBinder, 'of').and.returnValue(binder);

      let decorator = Mocks.object('decorator');
      let createDecoratorSpy = spyOn(bind, 'createDecorator_').and.returnValue(decorator);

      assert(bind.classList()).to.equal(decorator);
      assert(bind['createDecorator_']).to.haveBeenCalledWith(<any> Matchers.any((Function)));

      let element = Mocks.object('element');
      assert(createDecoratorSpy.calls.argsFor(0)[0](element)).to.equal(binder);
      assert(ClassListBinder.of).to.haveBeenCalledWith(element);
    });
  });

  describe('elementSwitch', () => {
    it('should create the decorator correctly', () => {
      let map = new Map();
      let binder = Mocks.object('binder');
      spyOn(ElementSwitchBinder, 'of').and.returnValue(binder);

      let decorator = Mocks.object('decorator');
      let createDecoratorSpy = spyOn(bind, 'createDecorator_').and.returnValue(decorator);

      assert(bind.elementSwitch<number>(map)).to.equal(decorator);
      assert(bind['createDecorator_']).to.haveBeenCalledWith(<any> Matchers.any((Function)));

      let element = Mocks.object('element');
      assert(createDecoratorSpy.calls.argsFor(0)[0](element)).to.equal(binder);
      assert(ElementSwitchBinder.of).to.haveBeenCalledWith(element, map);
    });
  });

  describe('innerText', () => {
    it('should return the correct factory to the property', () => {
      let decorator = Mocks.object('decorator');
      spyOn(bind, 'property').and.returnValue(decorator);
      assert(bind.innerText()).to.equal(decorator);
      assert(bind.property).to.haveBeenCalledWith('innerText');
    });
  });

  describe('property', () => {
    it('should attach the correct factory to the property', () => {
      let propertyName = 'propertyName';
      let ctor = Mocks.object('ctor');
      let target = Mocks.object('target');
      target.constructor = ctor;

      let propertyKey = 'propertyKey';

      let mockAnnotationsHandler =
          jasmine.createSpyObj('AnnotationsHandler', ['attachValueToProperty']);
      spyOn(ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotationsHandler);

      let targetEl = Mocks.object('targetEl');
      spyOn(Util, 'resolveSelector').and.returnValue(targetEl);

      let binder = Mocks.object('binder');
      spyOn(PropertyBinder, 'of').and.returnValue(binder);

      bind.property(propertyName)(target, propertyKey);
      assert(ANNOTATIONS.forCtor).to.haveBeenCalledWith(ctor);
      assert(mockAnnotationsHandler.attachValueToProperty).to.haveBeenCalledWith(
          propertyKey,
          jasmine.any(Function));

      let element = Mocks.object('element');
      assert(mockAnnotationsHandler.attachValueToProperty.calls.argsFor(0)[1](element))
          .to.equal(binder);
      assert(Util.resolveSelector).to.haveBeenCalledWith(SELECTOR, element);
      assert(PropertyBinder.of).to.haveBeenCalledWith(targetEl, propertyName);
    });
  });
});

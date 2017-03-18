import { assert, Matchers, TestBase } from '../test-base';
TestBase.setup();

import { Mocks } from '../mock/mocks';
import { AttributeBinder } from '../webc/attribute-binder';
import { ANNOTATIONS, Bind } from '../webc/bind';
import { ChildrenElementsBinder } from '../webc/children-elements-binder';
import { ClassListBinder } from '../webc/class-list-binder';
import { ElementSwitchBinder } from '../webc/element-switch-binder';
import { PropertyBinder } from '../webc/property-binder';
import { Util } from '../webc/util';


describe('webc.Bind', () => {
  const SELECTOR = 'SELECTOR';
  let bind: Bind;

  beforeEach(() => {
    bind = new Bind(SELECTOR);
  });

  describe('createDecorator_', () => {
    it('should return the correct decorator', () => {
      const ctor = Mocks.object('ctor');
      const target = Mocks.object('target');
      target.constructor = ctor;

      const propertyKey = 'propertyKey';
      const binder = Mocks.object('binder');
      const mockBinderFactory = jasmine.createSpy('BinderFactory');
      mockBinderFactory.and.returnValue(binder);

      const targetEl = Mocks.object('targetEl');
      spyOn(Util, 'resolveSelector').and.returnValue(targetEl);

      const mockAnnotationHandler =
          jasmine.createSpyObj('AnnotationHandler', ['attachValueToProperty']);
      spyOn(ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotationHandler);

      const decorator = bind['createDecorator_'](mockBinderFactory);
      decorator(target, propertyKey);

      assert(mockAnnotationHandler.attachValueToProperty).to
          .haveBeenCalledWith(propertyKey, Matchers.any(Function));

      const parentEl = Mocks.object('parentEl');
      const instance = Mocks.object('instance');
      assert(mockAnnotationHandler.attachValueToProperty.calls.argsFor(0)[1](parentEl, instance))
          .to.equal(binder);

      assert(mockBinderFactory).to.haveBeenCalledWith(targetEl, instance);
      assert(Util.resolveSelector).to.haveBeenCalledWith(SELECTOR, parentEl);

      assert(ANNOTATIONS.forCtor).to.haveBeenCalledWith(ctor);
    });
  });

  describe('attribute', () => {
    it('should attach the correct factory to the property', () => {
      const attributeName = 'attributeName';
      const ctor = Mocks.object('ctor');
      const parser = Mocks.object('parser');
      const target = Mocks.object('target');
      target.constructor = ctor;

      const propertyKey = 'propertyKey';

      const mockAnnotationsHandler =
          jasmine.createSpyObj('AnnotationsHandler', ['attachValueToProperty']);
      spyOn(ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotationsHandler);

      const targetEl = Mocks.object('targetEl');
      spyOn(Util, 'resolveSelector').and.returnValue(targetEl);

      const binder = Mocks.object('binder');
      spyOn(AttributeBinder, 'of').and.returnValue(binder);

      bind.attribute(attributeName, parser)(target, propertyKey);
      assert(ANNOTATIONS.forCtor).to.haveBeenCalledWith(ctor);
      assert(mockAnnotationsHandler.attachValueToProperty).to.haveBeenCalledWith(
          propertyKey,
          jasmine.any(Function));

      const element = Mocks.object('element');
      const binderFactory = mockAnnotationsHandler.attachValueToProperty.calls.argsFor(0)[1];
      assert(binderFactory.call(bind, element)).to.equal(binder);
      assert(Util.resolveSelector).to.haveBeenCalledWith(SELECTOR, element);
      assert(AttributeBinder.of).to.haveBeenCalledWith(targetEl, attributeName, parser);
    });
  });

  describe('childrenElement', () => {
    it('should attach the correct factory to the property', () => {
      const elementGenerator = Mocks.object('elementGenerator');
      const dataGetter = Mocks.object('dataGetter');
      const dataSetter = Mocks.object('dataSetter');
      const ctor = Mocks.object('ctor');
      const target = Mocks.object('target');
      const insertionIndex = 12;
      target.constructor = ctor;

      const propertyKey = 'propertyKey';

      const mockAnnotationsHandler =
          jasmine.createSpyObj('AnnotationsHandler', ['attachValueToProperty']);
      spyOn(ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotationsHandler);

      const targetEl = Mocks.object('targetEl');
      spyOn(Util, 'resolveSelector').and.returnValue(targetEl);

      const binder = Mocks.object('binder');
      spyOn(ChildrenElementsBinder, 'of').and.returnValue(binder);

      bind.childrenElements(
          elementGenerator,
          dataGetter,
          dataSetter,
          insertionIndex)(target, propertyKey);
      assert(ANNOTATIONS.forCtor).to.haveBeenCalledWith(ctor);
      assert(mockAnnotationsHandler.attachValueToProperty).to.haveBeenCalledWith(
          propertyKey,
          jasmine.any(Function));

      const element = Mocks.object('element');
      const instance = Mocks.object('instance');
      assert(mockAnnotationsHandler.attachValueToProperty.calls.argsFor(0)[1](element, instance))
          .to.equal(binder);
      assert(Util.resolveSelector).to.haveBeenCalledWith(SELECTOR, element);
      assert(ChildrenElementsBinder.of).to.haveBeenCalledWith(
          targetEl,
          dataGetter,
          dataSetter,
          elementGenerator,
          insertionIndex,
          instance);
    });
  });

  describe('classList', () => {
    it('should create the decorator correctly', () => {
      const binder = Mocks.object('binder');
      spyOn(ClassListBinder, 'of').and.returnValue(binder);

      const decorator = Mocks.object('decorator');
      const createDecoratorSpy = spyOn(bind, 'createDecorator_').and.returnValue(decorator);

      assert(bind.classList()).to.equal(decorator);
      assert(bind['createDecorator_']).to.haveBeenCalledWith(<any> Matchers.any((Function)));

      const element = Mocks.object('element');
      assert(createDecoratorSpy.calls.argsFor(0)[0](element)).to.equal(binder);
      assert(ClassListBinder.of).to.haveBeenCalledWith(element);
    });
  });

  describe('elementSwitch', () => {
    it('should create the decorator correctly', () => {
      const map = new Map();
      const binder = Mocks.object('binder');
      spyOn(ElementSwitchBinder, 'of').and.returnValue(binder);

      const decorator = Mocks.object('decorator');
      const createDecoratorSpy = spyOn(bind, 'createDecorator_').and.returnValue(decorator);

      assert(bind.elementSwitch<number>(map)).to.equal(decorator);
      assert(bind['createDecorator_']).to.haveBeenCalledWith(<any> Matchers.any((Function)));

      const element = Mocks.object('element');
      assert(createDecoratorSpy.calls.argsFor(0)[0](element)).to.equal(binder);
      assert(ElementSwitchBinder.of).to.haveBeenCalledWith(element, map);
    });
  });

  describe('innerText', () => {
    it('should return the correct factory to the property', () => {
      const decorator = Mocks.object('decorator');
      spyOn(bind, 'property').and.returnValue(decorator);
      assert(bind.innerText()).to.equal(decorator);
      assert(bind.property).to.haveBeenCalledWith('innerText');
    });
  });

  describe('property', () => {
    it('should attach the correct factory to the property', () => {
      const propertyName = 'propertyName';
      const ctor = Mocks.object('ctor');
      const target = Mocks.object('target');
      target.constructor = ctor;

      const propertyKey = 'propertyKey';

      const mockAnnotationsHandler =
          jasmine.createSpyObj('AnnotationsHandler', ['attachValueToProperty']);
      spyOn(ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotationsHandler);

      const targetEl = Mocks.object('targetEl');
      spyOn(Util, 'resolveSelector').and.returnValue(targetEl);

      const binder = Mocks.object('binder');
      spyOn(PropertyBinder, 'of').and.returnValue(binder);

      bind.property(propertyName)(target, propertyKey);
      assert(ANNOTATIONS.forCtor).to.haveBeenCalledWith(ctor);
      assert(mockAnnotationsHandler.attachValueToProperty).to.haveBeenCalledWith(
          propertyKey,
          jasmine.any(Function));

      const element = Mocks.object('element');
      assert(mockAnnotationsHandler.attachValueToProperty.calls.argsFor(0)[1](element))
          .to.equal(binder);
      assert(Util.resolveSelector).to.haveBeenCalledWith(SELECTOR, element);
      assert(PropertyBinder.of).to.haveBeenCalledWith(targetEl, propertyName);
    });
  });
});

import {assert, TestBase} from '../test-base';
TestBase.setup();

import {Mocks} from '../mock/mocks';

import {Annotations, AnnotationsHandler} from './annotations';


describe('data.AnnotationsHandler', () => {
  const __SYMBOL = Symbol('symbol');
  let parent;
  let handler: AnnotationsHandler<number>;

  beforeEach(() => {
    parent = Mocks.object('parent');
    handler = new AnnotationsHandler<number>(__SYMBOL, parent);
  });

  describe('attachValueToProperty', () => {
    it('should add the field value correctly', () => {
      let key = 'key';
      let value = 123;
      handler.attachValueToProperty(key, value);
      assert(handler['propertyValues_']).to.haveEntries([[key, value]]);
    });
  });

  describe('getAnnotatedProperties', () => {
    it('should return the correct field names', () => {
      let key1 = 'key1';
      let key2 = 'key2';
      let map = new Map<string, number>();
      map.set(key1, 123);
      map.set(key2, 456);

      spyOn(handler, 'getAttachedValues').and.returnValue(map);

      assert(handler.getAnnotatedProperties()).to.equal([key1, key2]);
    });
  });

  describe('getAttachedValues', () => {
    it('should return the correct map', () => {
      let key1 = 'key1';
      let key2 = 'key2';
      let value1 = 789;
      let value2 = 12;
      handler['propertyValues_'].set(key1, value1);
      handler['propertyValues_'].set(key2, value2);

      let parent1 = 'parent1';
      let parent2 = 'parent2';
      let parentValue1 = 123;
      let parentValue2 = 456;
      let parentMap = new Map<string, number>();
      parentMap.set(parent1, parentValue1);
      parentMap.set(parent2, parentValue2);

      let mockParentHandler = jasmine.createSpyObj('ParentHandler', ['getAttachedValues']);
      mockParentHandler.getAttachedValues.and.returnValue(parentMap);

      spyOn(AnnotationsHandler, 'of').and.returnValue(mockParentHandler);

      assert(handler.getAttachedValues()).to.haveEntries([
        [key1, value1],
        [key2, value2],
        [parent1, parentValue1],
        [parent2, parentValue2],
      ]);
      assert(AnnotationsHandler.of).to.haveBeenCalledWith(__SYMBOL, parent);
    });

    it('should work if there are no parent class', () => {
      let key1 = 'key1';
      let key2 = 'key2';
      let value1 = 789;
      let value2 = 12;
      handler['propertyValues_'].set(key1, value1);
      handler['propertyValues_'].set(key2, value2);

      handler['parent_'] = null;

      assert(handler.getAttachedValues()).to.haveEntries([
        [key1, value1],
        [key2, value2],
      ]);
    });
  });

  describe('hasAnnotation', () => {
    let proto;
    let annotation;

    beforeEach(() => {
      proto = Mocks.object('proto');
      annotation = Symbol('annotation');
    });

    it('should return true if the prototype has the given annotation', () => {
      proto[annotation] = Mocks.object('annotationHandler');
      assert(AnnotationsHandler.hasAnnotation(proto, annotation)).to.beTrue();
    });

    it('should return false if the prototype does not have the given annotation', () => {
      assert(AnnotationsHandler.hasAnnotation(proto, annotation)).to.beFalse();
    });
  });

  describe('of', () => {
    let ctor;
    let annotation;

    beforeEach(() => {
      ctor = Mocks.object('ctor');
      annotation = Symbol('annotation');
    });

    it('should create a new handler if one does not exist', () => {
      let parentCtor = Mocks.object('parentCtor');
      let parentProto = Mocks.object('parentProto');
      parentProto.constructor = parentCtor;

      spyOn(Object, 'getPrototypeOf').and.returnValue(parentProto);
      spyOn(AnnotationsHandler, 'hasAnnotation').and.returnValue(false);

      let handler = AnnotationsHandler.of(annotation, ctor);
      assert(ctor[annotation]).to.be(handler);
      assert(AnnotationsHandler.hasAnnotation).to.haveBeenCalledWith(ctor, annotation);
      assert(handler['parent_']).to.equal(parentCtor);
      assert(handler['annotation_']).to.equal(annotation);
      assert(Object.getPrototypeOf).to.haveBeenCalledWith(ctor.prototype);
    });

    it('should add the parent constructor if there is any', () => {
      spyOn(Object, 'getPrototypeOf').and.returnValue(null);
      spyOn(AnnotationsHandler, 'hasAnnotation').and.returnValue(false);

      let handler = AnnotationsHandler.of(annotation, ctor);
      assert(ctor[annotation]).to.be(handler);
      assert(AnnotationsHandler.hasAnnotation).to.haveBeenCalledWith(ctor, annotation);
      assert(handler['parent_']).to.equal(null);
      assert(handler['annotation_']).to.equal(annotation);
      assert(Object.getPrototypeOf).to.haveBeenCalledWith(ctor.prototype);
    });

    it('should reuse an existing annotations handler', () => {
      spyOn(Object, 'getPrototypeOf').and.returnValue(null);
      spyOn(AnnotationsHandler, 'hasAnnotation').and.returnValue(true);

      let handler = Mocks.object('handler');
      ctor[annotation] = handler;

      assert(AnnotationsHandler.of(annotation, ctor)).to.be(handler);
    });
  });
});

describe('data.Annotations', () => {
  const __SYMBOL = Symbol('symbol');
  let annotations: Annotations<number>;

  beforeEach(() => {
    annotations = new Annotations<number>(__SYMBOL);
  });

  describe('forCtor', () => {
    class BaseClass {}

    class SubClass extends BaseClass {}

    it('should create a correct instance of annotations handler', () => {
      let handler = Mocks.object('handler');
      spyOn(AnnotationsHandler, 'of').and.returnValue(handler);

      assert(annotations.forCtor(BaseClass)).to.equal(handler);
      assert(AnnotationsHandler.of).to.haveBeenCalledWith(__SYMBOL, BaseClass);
    });

    it('should specify the parent class correctly', () => {
      let handler = Mocks.object('handler');
      spyOn(AnnotationsHandler, 'of').and.returnValue(handler);

      assert(annotations.forCtor(SubClass)).to.equal(handler);
      assert(AnnotationsHandler.of).to.haveBeenCalledWith(__SYMBOL, SubClass);
    });
  });

  describe('hasAnnotation', () => {
    it('should return true if the prototype has the given annotation', () => {
      let proto = Mocks.object('proto');
      spyOn(AnnotationsHandler, 'hasAnnotation').and.returnValue(true);

      assert(annotations.hasAnnotation(proto)).to.beTrue();
      assert(AnnotationsHandler.hasAnnotation).to.haveBeenCalledWith(proto, __SYMBOL);
    });

    it('should return false if the prototype does not have the given annotation', () => {
      let proto = Mocks.object('proto');
      spyOn(AnnotationsHandler, 'hasAnnotation').and.returnValue(false);

      assert(annotations.hasAnnotation(proto)).to.beFalse();
      assert(AnnotationsHandler.hasAnnotation).to.haveBeenCalledWith(proto, __SYMBOL);
    });
  });
});

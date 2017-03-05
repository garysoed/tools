import { assert, Matchers, TestBase } from '../test-base';
TestBase.setup();

import { Maps } from '../collection/maps';
import { Annotations, AnnotationsHandler } from '../data/annotations';
import { Mocks } from '../mock/mocks';


describe('data.AnnotationsHandler', () => {
  const __SYMBOL = Symbol('symbol');
  let parent;
  let handler: AnnotationsHandler<number>;

  beforeEach(() => {
    parent = Mocks.object('parent');
    handler = new AnnotationsHandler<number>(__SYMBOL, parent);
    AnnotationsHandler['REGISTERED_ANNOTATIONS_'].clear();
  });

  describe('attachValueToProperty', () => {
    it('should add the field value correctly', () => {
      const key = 'key';
      const value = 123;
      handler.attachValueToProperty(key, value);

      const values = Maps.of(handler['propertyValues_']).asRecord();
      assert(values).to.equal(Matchers.objectContaining({
        [key]: Matchers.any(Set),
      }));
      assert(values[key]).to.haveElements([value]);
    });
  });

  describe('getAnnotatedProperties', () => {
    it('should return the correct field names', () => {
      const key1 = 'key1';
      const key2 = 'key2';
      const map = new Map<string, number>();
      map.set(key1, 123);
      map.set(key2, 456);

      spyOn(handler, 'getAttachedValues').and.returnValue(map);

      assert(handler.getAnnotatedProperties()).to.equal([key1, key2]);
    });
  });

  describe('getAttachedValues', () => {
    it('should return the correct map', () => {
      const key1 = 'key1';
      const key2 = 'key2';
      const value1 = 789;
      const value2 = 12;
      handler['propertyValues_'].set(key1, new Set([value1]));
      handler['propertyValues_'].set(key2, new Set([value2]));

      const parent1 = 'parent1';
      const parent2 = 'parent2';
      const parentValues1 = Mocks.object('parentValues1');
      const parentValues2 = Mocks.object('parentValues2');
      const parentMap = new Map<string, number>();
      parentMap.set(parent1, parentValues1);
      parentMap.set(parent2, parentValues2);

      const mockParentHandler = jasmine.createSpyObj('ParentHandler', ['getAttachedValues']);
      mockParentHandler.getAttachedValues.and.returnValue(parentMap);

      spyOn(AnnotationsHandler, 'of').and.returnValue(mockParentHandler);

      const values = Maps.of(handler.getAttachedValues()).asRecord();
      assert(values).to.equal(Matchers.objectContaining({
        [key1]: Matchers.any(Set),
        [key2]: Matchers.any(Set),
        [parent1]: Mocks.object('parentValues1'),
        [parent2]: Mocks.object('parentValues2'),
      }));
      assert(values[key1]).to.haveElements([value1]);
      assert(values[key2]).to.haveElements([value2]);
      assert(AnnotationsHandler.of).to.haveBeenCalledWith(__SYMBOL, parent);
    });

    it('should work if there are no parent class', () => {
      const key1 = 'key1';
      const key2 = 'key2';
      const value1 = 789;
      const value2 = 12;
      handler = new AnnotationsHandler<number>(__SYMBOL, null);
      handler['propertyValues_'].set(key1, new Set([value1]));
      handler['propertyValues_'].set(key2, new Set([value2]));


      const values = Maps.of(handler.getAttachedValues()).asRecord();
      assert(values).to.equal(Matchers.objectContaining({
        [key1]: Matchers.any(Set),
        [key2]: Matchers.any(Set),
      }));
      assert(values[key1]).to.haveElements([value1]);
      assert(values[key2]).to.haveElements([value2]);
    });
  });

  describe('createHash_', () => {
    it('should create the hash value correctly', () => {
      const ctor = Mocks.object('ctor');
      const annotation = Symbol('annotation');
      assert(AnnotationsHandler['createHash_'](ctor, annotation))
          .to.equal(`${ctor}_${String(annotation)}`);
    });
  });

  describe('hasAnnotation', () => {
    it('should return true if the constructor has the given annotation', () => {
      const hash = 'hash';
      spyOn(AnnotationsHandler, 'createHash_').and.returnValue(hash);

      const annotationHandler = Mocks.object('annotationHandler');
      AnnotationsHandler['REGISTERED_ANNOTATIONS_'].set(hash, annotationHandler);

      const ctor = Mocks.object('ctor');
      const annotation = Mocks.object('annotation');
      assert(AnnotationsHandler.hasAnnotation(ctor, annotation)).to.beTrue();
      assert(AnnotationsHandler['createHash_']).to.haveBeenCalledWith(ctor, annotation);
    });

    it('should return false if the constructor does not have the given annotation', () => {
      const ctor = Mocks.object('ctor');
      const annotation = Mocks.object('annotation');
      assert(AnnotationsHandler.hasAnnotation(ctor, annotation)).to.beFalse();
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
      const parentCtor = Mocks.object('parentCtor');
      const parentProto = Mocks.object('parentProto');
      parentProto.constructor = parentCtor;

      const hash = 'hash';
      spyOn(AnnotationsHandler, 'createHash_').and.returnValue(hash);

      spyOn(Object, 'getPrototypeOf').and.returnValue(parentProto);
      spyOn(AnnotationsHandler, 'hasAnnotation').and.returnValue(false);

      const handler = AnnotationsHandler.of(annotation, ctor);
      assert(AnnotationsHandler['REGISTERED_ANNOTATIONS_'].get(hash)).to.be(handler);
      assert(AnnotationsHandler['createHash_']).to.haveBeenCalledWith(ctor, annotation);
      assert(handler['parent_']).to.equal(parentCtor);
      assert(handler['annotation_']).to.equal(annotation);
      assert(Object.getPrototypeOf).to.haveBeenCalledWith(ctor.prototype);
    });

    it('should not add the parent constructor if there is none', () => {
      const hash = 'hash';
      spyOn(AnnotationsHandler, 'createHash_').and.returnValue(hash);

      spyOn(Object, 'getPrototypeOf').and.returnValue(null);
      spyOn(AnnotationsHandler, 'hasAnnotation').and.returnValue(false);

      const handler = AnnotationsHandler.of(annotation, ctor);
      assert(AnnotationsHandler['REGISTERED_ANNOTATIONS_'].get(hash)).to.be(handler);
      assert(AnnotationsHandler['createHash_']).to.haveBeenCalledWith(ctor, annotation);
      assert(handler['parent_']).to.equal(null);
      assert(handler['annotation_']).to.equal(annotation);
      assert(Object.getPrototypeOf).to.haveBeenCalledWith(ctor.prototype);
    });

    it('should reuse an existing annotations handler', () => {
      const hash = 'hash';
      spyOn(AnnotationsHandler, 'createHash_').and.returnValue(hash);

      const cachedHandler = Mocks.object('cachedHandler');
      AnnotationsHandler['REGISTERED_ANNOTATIONS_'].set(hash, cachedHandler);

      assert(AnnotationsHandler.of(annotation, ctor)).to.be(cachedHandler);
      assert(AnnotationsHandler['REGISTERED_ANNOTATIONS_'].get(hash)).to.be(cachedHandler);
      assert(AnnotationsHandler['createHash_']).to.haveBeenCalledWith(ctor, annotation);
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
      const handler = Mocks.object('handler');
      spyOn(AnnotationsHandler, 'of').and.returnValue(handler);

      assert(annotations.forCtor(BaseClass)).to.equal(handler);
      assert(AnnotationsHandler.of).to.haveBeenCalledWith(__SYMBOL, BaseClass);
    });

    it('should specify the parent class correctly', () => {
      const handler = Mocks.object('handler');
      spyOn(AnnotationsHandler, 'of').and.returnValue(handler);

      assert(annotations.forCtor(SubClass)).to.equal(handler);
      assert(AnnotationsHandler.of).to.haveBeenCalledWith(__SYMBOL, SubClass);
    });
  });

  describe('hasAnnotation', () => {
    it('should return true if the prototype has the given annotation', () => {
      const proto = Mocks.object('proto');
      spyOn(AnnotationsHandler, 'hasAnnotation').and.returnValue(true);

      assert(annotations.hasAnnotation(proto)).to.beTrue();
      assert(AnnotationsHandler.hasAnnotation).to.haveBeenCalledWith(proto, __SYMBOL);
    });

    it('should return false if the prototype does not have the given annotation', () => {
      const proto = Mocks.object('proto');
      spyOn(AnnotationsHandler, 'hasAnnotation').and.returnValue(false);

      assert(annotations.hasAnnotation(proto)).to.beFalse();
      assert(AnnotationsHandler.hasAnnotation).to.haveBeenCalledWith(proto, __SYMBOL);
    });
  });
});

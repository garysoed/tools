import {assert, TestBase} from '../test-base';
TestBase.setup();

import {Annotations, AnnotationsHandler} from './annotations';
import {Mocks} from '../mock/mocks';


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
    let proto;
    let annotation;
    let parent;

    beforeEach(() => {
      proto = Mocks.object('proto');
      annotation = Symbol('annotation');
      parent = Mocks.object('parent');
    });

    it('should create a new handler if one does not exist', () => {
      spyOn(AnnotationsHandler, 'hasAnnotation').and.returnValue(false);

      let handler = AnnotationsHandler.of(annotation, proto, parent);
      assert(proto[annotation]).to.be(handler);
      assert(AnnotationsHandler.hasAnnotation).to.haveBeenCalledWith(proto, annotation);
      assert(handler['parent_']).to.equal(parent);
      assert(handler['annotation_']).to.equal(annotation);
    });

    it('should reuse an existing annotations handler', () => {
      spyOn(AnnotationsHandler, 'hasAnnotation').and.returnValue(true);

      let handler = Mocks.object('handler');
      proto[annotation] = handler;

      assert(AnnotationsHandler.of(annotation, proto, parent)).to.be(handler);
    });
  });
});

describe('data.Annotations', () => {
  const __SYMBOL = Symbol('symbol');
  let annotations: Annotations;

  beforeEach(() => {
    annotations = new Annotations(__SYMBOL);
  });

  describe('forPrototype', () => {
    it('should create a correct instance of annotations handler', () => {
      let parent = Mocks.object('parent');
      let proto = Mocks.object('proto');
      let handler = Mocks.object('handler');
      spyOn(AnnotationsHandler, 'of').and.returnValue(handler);

      assert(annotations.forPrototype(proto, parent)).to.equal(handler);
      assert(AnnotationsHandler.of).to.haveBeenCalledWith(__SYMBOL, proto, parent);
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

import { assert, setup, should, test } from 'gs-testing/export/main';
import { mocks } from 'gs-testing/export/mock';
import { createSpyInstance, createSpyObject, fake, spy } from 'gs-testing/export/spy';
import { Annotations, AnnotationsHandler } from '../data/annotations';
import { ImmutableList } from '../immutable';
import { ImmutableMap } from '../immutable/immutable-map';

test('data.AnnotationsHandler', () => {
  const __SYMBOL = Symbol('symbol');
  let parent: any;
  let handler: AnnotationsHandler<number>;

  setup(() => {
    parent = mocks.object('parent');
    handler = new AnnotationsHandler<number>(__SYMBOL, parent);
    AnnotationsHandler['REGISTERED_ANNOTATIONS_'].clear();
  });

  test('attachValueToProperty', () => {
    should('add the field value correctly', () => {
      const key = 'key';
      const value = 123;
      handler.attachValueToProperty(key, value);

      // tslint:disable-next-line:no-non-null-assertion
      assert(handler['propertyValues_'].get(key)!).to.haveElements([value]);
    });
  });

  test('getAnnotatedProperties', () => {
    should('return the correct field names', () => {
      const key1 = 'key1';
      const key2 = 'key2';
      const map = ImmutableMap.of([
        [key1, ImmutableList.of([123])],
        [key2, ImmutableList.of([456])],
      ]);

      fake(spy(handler, 'getAttachedValues')).always().return(map);

      assert(handler.getAnnotatedProperties()).to.haveElements([key1, key2]);
    });
  });

  test('getAttachedValues', () => {
    should('return the correct map', () => {
      const key1 = 'key1';
      const key2 = 'key2';
      const value1 = 789;
      const value2 = 12;
      handler['propertyValues_'].set(key1, new Set([value1]));
      handler['propertyValues_'].set(key2, new Set([value2]));

      const parent1 = 'parent1';
      const parent2 = 'parent2';
      const parentValues1 = ImmutableList.of([123]);
      const parentValues2 = ImmutableList.of([456]);
      const parentMap = ImmutableMap.of([
        [parent1, parentValues1],
        [parent2, parentValues2],
      ]);

      const mockParentHandler = createSpyInstance(AnnotationsHandler);
      fake(mockParentHandler.getAttachedValues).always().return(parentMap);

      const annotationsOfSpy = spy(AnnotationsHandler, 'of');
      fake(annotationsOfSpy).always().return(mockParentHandler);

      const attachedValues = handler.getAttachedValues();
      // tslint:disable-next-line:no-non-null-assertion
      assert(attachedValues.get(key1)!).to.haveElements([value1]);
      // tslint:disable-next-line:no-non-null-assertion
      assert(attachedValues.get(key2)!).to.haveElements([value2]);
      // tslint:disable-next-line:no-non-null-assertion
      assert(attachedValues.get(parent1)!).to.haveElements(parentValues1);
      // tslint:disable-next-line:no-non-null-assertion
      assert(attachedValues.get(parent2)!).to.haveElements(parentValues2);
      assert(annotationsOfSpy).to.haveBeenCalledWith(__SYMBOL, parent);
    });

    should('work if there are no parent class', () => {
      const key1 = 'key1';
      const key2 = 'key2';
      const value1 = 789;
      const value2 = 12;
      handler = new AnnotationsHandler<number>(__SYMBOL, null);
      handler['propertyValues_'].set(key1, new Set([value1]));
      handler['propertyValues_'].set(key2, new Set([value2]));


      const attachedValues = handler.getAttachedValues();
      // tslint:disable-next-line:no-non-null-assertion
      assert(attachedValues.get(key1)!).to.haveElements([value1]);
      // tslint:disable-next-line:no-non-null-assertion
      assert(attachedValues.get(key2)!).to.haveElements([value2]);
    });
  });

  test('hasAnnotation', () => {
    should('return true if the constructor has the given annotation', () => {
      const hash = 'hash';
      const createHashSpy = spy(AnnotationsHandler, 'createHash_');
      fake(createHashSpy).always().return(hash);

      const annotationHandler = mocks.object<AnnotationsHandler<any>>('annotationHandler');
      AnnotationsHandler['REGISTERED_ANNOTATIONS_'].set(hash, annotationHandler);

      const ctor = mocks.object('ctor');
      const annotation = Symbol('annotation');
      assert(AnnotationsHandler.hasAnnotation(ctor, annotation)).to.beTrue();
      assert(createHashSpy).to.haveBeenCalledWith(ctor, annotation);
    });

    should('return false if the constructor does not have the given annotation', () => {
      const ctor = mocks.object('ctor');
      const annotation = Symbol('annotation');
      assert(AnnotationsHandler.hasAnnotation(ctor, annotation)).to.beFalse();
    });
  });

  test('of', () => {
    class ParentClass {}

    class TestClass extends ParentClass {}
    let annotation: symbol;

    setup(() => {
      annotation = Symbol('annotation');
    });

    should('create a new handler if one does not exist', () => {
      const hash = 'hash';
      const createHashSpy = spy(AnnotationsHandler, 'createHash_');
      fake(createHashSpy).always().return(hash);

      fake(spy(AnnotationsHandler, 'hasAnnotation')).always().return(false);

      const annotationsHandler = AnnotationsHandler.of(annotation, TestClass);
      // TODO: Do not reference private fields
      assert(AnnotationsHandler['REGISTERED_ANNOTATIONS_'].get(hash)).to.equal(annotationsHandler);
      assert(createHashSpy).to.haveBeenCalledWith(TestClass, annotation);
      assert(annotationsHandler['parent_']).to.equal(ParentClass);
      assert(annotationsHandler['annotation_']).to.equal(annotation);
    });

    should('not add the parent constructor if there is none', () => {
      const hash = 'hash';
      const createHashSpy = spy(AnnotationsHandler, 'createHash_');
      fake(createHashSpy).always().return(hash);

      fake(spy(AnnotationsHandler, 'hasAnnotation')).always().return(false);

      const annotationsHandler = AnnotationsHandler.of(annotation, Object);
      assert(AnnotationsHandler['REGISTERED_ANNOTATIONS_'].get(hash)).to.equal(annotationsHandler);
      assert(createHashSpy).to.haveBeenCalledWith(Object, annotation);
      assert(annotationsHandler['parent_']).to.beNull();
      assert(annotationsHandler['annotation_']).to.equal(annotation);
    });

    should('reuse an existing annotations handler', () => {
      const hash = 'hash';
      const createHashSpy = spy(AnnotationsHandler, 'createHash_');
      fake(createHashSpy).always().return(hash);

      const cachedHandler = mocks.object<AnnotationsHandler<any>>('cachedHandler');
      AnnotationsHandler['REGISTERED_ANNOTATIONS_'].set(hash, cachedHandler);

      assert(AnnotationsHandler.of(annotation, TestClass)).to.equal(cachedHandler);
      assert(AnnotationsHandler['REGISTERED_ANNOTATIONS_'].get(hash)).to.equal(cachedHandler);
      assert(createHashSpy).to.haveBeenCalledWith(TestClass, annotation);
    });
  });
});

test('data.Annotations', () => {
  const __SYMBOL = Symbol('symbol');
  let annotations: Annotations<number>;

  setup(() => {
    annotations = new Annotations<number>(__SYMBOL);
  });

  test('forCtor', () => {
    /**
     * @test
     */
    class BaseClass {}

    /**
     * @test
     */
    class SubClass extends BaseClass {}

    should('create a correct instance of annotations handler', () => {
      const handler = mocks.object<AnnotationsHandler<any>>('handler');
      const ofSpy = spy(AnnotationsHandler, 'of');
      fake(ofSpy).always().return(handler);

      assert(annotations.forCtor(BaseClass)).to.equal(handler);
      assert(ofSpy).to.haveBeenCalledWith(__SYMBOL, BaseClass);
    });

    should('specify the parent class correctly', () => {
      const handler = mocks.object<AnnotationsHandler<any>>('handler');
      const ofSpy = spy(AnnotationsHandler, 'of');
      fake(ofSpy).always().return(handler);

      assert(annotations.forCtor(SubClass)).to.equal(handler);
      assert(ofSpy).to.haveBeenCalledWith(__SYMBOL, SubClass);
    });
  });

  test('hasAnnotation', () => {
    should('return true if the prototype has the given annotation', () => {
      const proto = mocks.object('proto');
      const hasAnnotationSpy = spy(AnnotationsHandler, 'hasAnnotation');
      fake(hasAnnotationSpy).always().return(true);

      assert(annotations.hasAnnotation(proto)).to.beTrue();
      assert(hasAnnotationSpy).to.haveBeenCalledWith(proto, __SYMBOL);
    });

    should('return false if the prototype does not have the given annotation', () => {
      const proto = mocks.object('proto');
      const hasAnnotationSpy = spy(AnnotationsHandler, 'hasAnnotation');
      fake(hasAnnotationSpy).always().return(false);

      assert(annotations.hasAnnotation(proto)).to.beFalse();
      assert(hasAnnotationSpy).to.haveBeenCalledWith(proto, __SYMBOL);
    });
  });
});

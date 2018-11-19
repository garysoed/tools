import { TestBase } from 'gs-testing/export/main';


import { assert } from 'gs-testing/export/main';
import { Fakes, mocks } from 'gs-testing/export/mock';
import * as Equals from '../data/equals';
import { ImmutableSet } from '../immutable/immutable-set';


describe('data.Equals', () => {
  describe('equals', () => {
    should('recursively check the fields', () => {
      const ctor = mocks.object('ctor');

      const key1 = 'key1';
      const key2 = 'key2';

      const value1A = mocks.object('value1A');
      const value2A = mocks.object('value2A');
      const a = {
        [key1]: value1A,
        [key2]: value2A,
        constructor: ctor,
      };

      const value1B = mocks.object('value1B');
      const value2B = mocks.object('value2B');
      const b = {
        [key1]: value1B,
        [key2]: value2B,
      };

      const mockAnnotationHandler = jasmine
          .createSpyObj('AnnotationHandler', ['getAnnotatedProperties']);
      mockAnnotationHandler.getAnnotatedProperties.and.returnValue(ImmutableSet.of([key1, key2]));

      spyOn(Equals.ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotationHandler);
      spyOn(Equals.ANNOTATIONS, 'hasAnnotation').and.returnValue(true);

      const originalEquals = Equals.equals;
      Fakes.build(spyOn(Equals, 'equals'))
          .when(value1A).return(true)
          .when(value2A).return(true)
          .else().call(originalEquals);

      assert(Equals.equals(a, b)).to.beTrue();
      assert(Equals.equals).to.haveBeenCalledWith(value1A, value1B);
      assert(Equals.equals).to.haveBeenCalledWith(value2A, value2B);
      assert(Equals.ANNOTATIONS.hasAnnotation).to.haveBeenCalledWith(ctor);
      assert(Equals.ANNOTATIONS.forCtor).to.haveBeenCalledWith(ctor);
    });

    should('return false if one of the recursive fields is different', () => {
      const ctor = mocks.object('ctor');

      const key1 = 'key1';
      const key2 = 'key2';

      const value1A = mocks.object('value1A');
      const value2A = mocks.object('value2A');
      const a = {
        [key1]: value1A,
        [key2]: value2A,
        constructor: ctor,
      };

      const value1B = mocks.object('value1B');
      const value2B = mocks.object('value2B');
      const b = {
        [key1]: value1B,
        [key2]: value2B,
      };

      const mockAnnotationHandler = jasmine
          .createSpyObj('AnnotationHandler', ['getAnnotatedProperties']);
      mockAnnotationHandler.getAnnotatedProperties.and.returnValue(ImmutableSet.of([key1, key2]));

      spyOn(Equals.ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotationHandler);
      spyOn(Equals.ANNOTATIONS, 'hasAnnotation').and.returnValue(true);

      const originalEquals = Equals.equals;
      Fakes.build(spyOn(Equals, 'equals'))
          .when(value1A).return(false)
          .when(value2A).return(true)
          .else().call(originalEquals);

      assert(Equals.equals(a, b)).to.beFalse();
    });

    should('use === for values with no annotations', () => {
      const object = mocks.object('object');
      const a = object;
      const b = object;
      const other = mocks.object('object');

      spyOn(Equals.ANNOTATIONS, 'hasAnnotation').and.returnValue(false);

      assert(Equals.equals(a, b)).to.beTrue();
      assert(Equals.equals(a, other)).to.beFalse();
    });

    should('use === for values that are not Objects', () => {
      const a = 123;
      const b = 123;
      const other = 456;

      assert(Equals.equals(a, b)).to.beTrue();
      assert(Equals.equals(a, other)).to.beFalse();
    });
  });

  describe('Property', () => {
    should('add the field correctly', () => {
      const mockAnnotationHandler =
          createSpyObject('AnnotationHandler', ['attachValueToProperty']);

      spyOn(Equals.ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotationHandler);

      const ctor = mocks.object('ctor');
      const key = 'key';

      Equals.Property()({constructor: ctor}, key);

      assert(Equals.ANNOTATIONS.forCtor).to.haveBeenCalledWith(ctor);
      assert(mockAnnotationHandler.attachValueToProperty).to.haveBeenCalledWith(key, {});
    });
  });
});

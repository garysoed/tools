import { assert, match, should } from 'gs-testing/export/main';
import { mocks } from 'gs-testing/export/mock';
import { createSpyObject, spy } from 'gs-testing/export/spy';
import { fake } from 'gs-testing/export/spy';
import * as Equals from '../data/equals';
import { ImmutableSet } from '../immutable/immutable-set';
import { AnnotationsHandler } from './annotations';


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

      const forCtorSpy = spy(Equals.ANNOTATIONS, 'forCtor');
      fake(forCtorSpy).always().return(mockAnnotationHandler);

      const hasAnnotationSpy = spy(Equals.ANNOTATIONS, 'hasAnnotation');
      fake(hasAnnotationSpy).always().return(true);

      const originalEquals = Equals.equals;
      const equalsSpy = spy(Equals, 'equals');
      fake(equalsSpy)
          .when(value1A, match.anyThing()).return(true)
          .when(value2A, match.anyThing()).return(true)
          .always().call(originalEquals);

      assert(Equals.equals(a, b)).to.beTrue();
      assert(equalsSpy).to.haveBeenCalledWith(value1A, value1B);
      assert(equalsSpy).to.haveBeenCalledWith(value2A, value2B);
      assert(hasAnnotationSpy).to.haveBeenCalledWith(ctor);
      assert(forCtorSpy).to.haveBeenCalledWith(ctor);
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

      const forCtorSpy = spy(Equals.ANNOTATIONS, 'forCtor');
      fake(forCtorSpy).always().return(mockAnnotationHandler);

      const hasAnnotationSpy = spy(Equals.ANNOTATIONS, 'hasAnnotation');
      fake(hasAnnotationSpy).always().return(true);

      const originalEquals = Equals.equals;
      const equalsSpy = spy(Equals, 'equals');
      fake(equalsSpy)
          .when(value1A, match.anyThing()).return(false)
          .when(value2A, match.anyThing()).return(true)
          .always().call(originalEquals);

      assert(Equals.equals(a, b)).to.beFalse();
    });

    should('use === for values with no annotations', () => {
      const object = mocks.object('object');
      const a = object;
      const b = object;
      const other = mocks.object('object');

      const hasAnnotationSpy = spy(Equals.ANNOTATIONS, 'hasAnnotation');
      fake(hasAnnotationSpy).always().return(false);

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
          createSpyObject<AnnotationsHandler<any>>('AnnotationHandler', ['attachValueToProperty']);

      const forCtorSpy = spy(Equals.ANNOTATIONS, 'forCtor');
      fake(forCtorSpy).always().return(mockAnnotationHandler);

      const ctor = mocks.object('ctor');
      const key = 'key';

      // TODO: Remove typecast.
      // tslint:disable-next-line:no-object-literal-type-assertion
      Equals.Property()({constructor: ctor} as Object, key);

      assert(forCtorSpy).to.haveBeenCalledWith(ctor);
      assert(mockAnnotationHandler.attachValueToProperty).to.haveBeenCalledWith(key, {});
    });
  });
});

import {assert, TestBase} from '../test-base';
TestBase.setup();

import {Mocks} from '../mock/mocks';

import {ANNOTATIONS, Equals} from './equals';


describe('data.Equals', () => {
  describe('equals', () => {
    it('should recursively check the fields', () => {
      let ctor = Mocks.object('ctor');

      let key1 = 'key1';
      let key2 = 'key2';

      let value1A = Mocks.object('value1A');
      let value2A = Mocks.object('value2A');
      let a = {
        [key1]: value1A,
        [key2]: value2A,
        constructor: ctor,
      };

      let value1B = Mocks.object('value1B');
      let value2B = Mocks.object('value2B');
      let b = {
        [key1]: value1B,
        [key2]: value2B,
      };

      let mockAnnotationHandler = jasmine
          .createSpyObj('AnnotationHandler', ['getAnnotatedProperties']);
      mockAnnotationHandler.getAnnotatedProperties.and.returnValue([key1, key2]);

      spyOn(ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotationHandler);
      spyOn(ANNOTATIONS, 'hasAnnotation').and.returnValue(true);

      let originalEquals = Equals.equals;
      spyOn(Equals, 'equals').and.callFake((a: any, b: any): boolean => {
        switch (a) {
          case value1A:
            return true;
          case value2A:
            return true;
          default:
            return originalEquals(a, b);
        }
      });

      assert(Equals.equals(a, b)).to.beTrue();
      assert(Equals.equals).to.haveBeenCalledWith(value1A, value1B);
      assert(Equals.equals).to.haveBeenCalledWith(value2A, value2B);
      assert(ANNOTATIONS.hasAnnotation).to.haveBeenCalledWith(ctor);
      assert(ANNOTATIONS.forCtor).to.haveBeenCalledWith(ctor);
    });

    it('should return false if one of the recursive fields is different', () => {
      let ctor = Mocks.object('ctor');

      let key1 = 'key1';
      let key2 = 'key2';

      let value1A = Mocks.object('value1A');
      let value2A = Mocks.object('value2A');
      let a = {
        [key1]: value1A,
        [key2]: value2A,
        constructor: ctor,
      };

      let value1B = Mocks.object('value1B');
      let value2B = Mocks.object('value2B');
      let b = {
        [key1]: value1B,
        [key2]: value2B,
      };

      let mockAnnotationHandler = jasmine
          .createSpyObj('AnnotationHandler', ['getAnnotatedProperties']);
      mockAnnotationHandler.getAnnotatedProperties.and.returnValue([key1, key2]);

      spyOn(ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotationHandler);
      spyOn(ANNOTATIONS, 'hasAnnotation').and.returnValue(true);

      let originalEquals = Equals.equals;
      spyOn(Equals, 'equals').and.callFake((a: any, b: any): boolean => {
        switch (a) {
          case value1A:
            return false;
          case value2A:
            return true;
          default:
            return originalEquals(a, b);
        }
      });

      assert(Equals.equals(a, b)).to.beFalse();
    });

    it('should use === for values with no annotations', () => {
      let object = Mocks.object('object');
      let a = object;
      let b = object;
      let other = Mocks.object('object');

      spyOn(ANNOTATIONS, 'hasAnnotation').and.returnValue(false);

      assert(Equals.equals(a, b)).to.beTrue();
      assert(Equals.equals(a, other)).to.beFalse();
    });

    it('should use === for values that are not Objects', () => {
      let a = 123;
      let b = 123;
      let other = 456;

      assert(Equals.equals(a, b)).to.beTrue();
      assert(Equals.equals(a, other)).to.beFalse();
    });
  });

  describe('Property', () => {
    it('should add the field correctly', () => {
      let mockAnnotationHandler =
          jasmine.createSpyObj('AnnotationHandler', ['attachValueToProperty']);

      spyOn(ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotationHandler);

      let ctor = Mocks.object('ctor');
      let key = 'key';

      Equals.Property()({constructor: ctor}, key);

      assert(ANNOTATIONS.forCtor).to.haveBeenCalledWith(ctor);
      assert(mockAnnotationHandler.attachValueToProperty).to.haveBeenCalledWith(key, {});
    });
  });
});

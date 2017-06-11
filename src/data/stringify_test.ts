import { assert, TestBase } from '../test-base';
TestBase.setup();

import { NativeType } from '../check/native-type';
import { ANNOTATIONS, Stringify } from '../data/stringify';
import { Fakes } from '../mock/fakes';
import { Mocks } from '../mock/mocks';


describe('data.Stringify', () => {
  describe('formatField_', () => {
    it('should stringify strings correctly', () => {
      assert(Stringify['formatField_']('abc', '|', '--', '>>')).to.equal('"abc"');
    });

    it('should stringify native values correctly', () => {
      const field = 123;
      spyOn(NativeType, 'check').and.returnValue(true);
      assert(Stringify['formatField_'](field, '|', '--', '>>')).to.equal(`${field}`);
      assert(NativeType.check).to.haveBeenCalledWith(field);
    });

    it('should stringify Dates correctly', () => {
      const date = new Date(123);
      assert(Stringify['formatField_'](date, '|', '--')).to.equal(date.toLocaleString());
    });

    it('should stringify Functions correctly', () => {
      const f = function a(_a: any, _b: any, _c: any): any {};
      assert(Stringify['formatField_'](f, '|', '--', '>>')).to.equal('function a(_a, _b, _c)');
    });

    it('should stringify objects correctly without padding', () => {
      const key1 = 'key1';
      const value1 = Mocks.object('value1');
      const key2 = 'key2';
      const value2 = Mocks.object('value2');

      const instance = {[key1]: value1, [key2]: value2};

      const stringifiedValue1 = 'stringifiedValue1';
      const stringifiedValue2 = 'stringifiedValue2';
      const originalFormatField_ = Stringify['formatField_'];
      Fakes.build(spyOn(Stringify, 'formatField_'))
          .when(value1).return(stringifiedValue1)
          .when(value2).return(stringifiedValue2)
          .else().call((field: any, delimiter: string, pad: string, indent: string) => {
            return originalFormatField_(field, delimiter, pad, indent);
          });

      const result = Stringify['formatField_'](instance, '|', '', '>>');
      assert(result).to.equal(`{${key1}: ${stringifiedValue1}|${key2}: ${stringifiedValue2}}`);
    });

    it('should stringify objects correctly with padding', () => {
      const key1 = 'key1';
      const value1 = Mocks.object('value1');
      const key2 = 'key2';
      const value2 = Mocks.object('value2');

      const instance = {[key1]: value1, [key2]: value2};

      const stringifiedValue1 = 'stringifiedValue1';
      const stringifiedValue2 = 'stringifiedValue2';
      const originalFormatField_ = Stringify['formatField_'];

      Fakes.build(spyOn(Stringify, 'formatField_'))
          .when(value1).return(stringifiedValue1)
          .when(value2).return(stringifiedValue2)
          .else().call((field: any, delimiter: string, pad: string, indent: string) => {
            return originalFormatField_(field, delimiter, pad, indent);
          });

      const result = Stringify['formatField_'](instance, '|', '--', '>>');
      assert(result).to.equal([
        '{',
        `-->>${key1}: ${stringifiedValue1}|`,
        `-->>${key2}: ${stringifiedValue2}`,
        '>>}',
      ].join('\n'));
    });
  });

  describe('grabFields_', () => {
    it('should grab all the fields with stringify annotation', () => {
      const ctor = Mocks.object('ctor');
      const key1 = 'key1';
      const value1 = Mocks.object('value1');
      const normalizedValue1 = Mocks.object('normalizedValue1');
      const key2 = 'key2';
      const value2 = Mocks.object('value2');
      const normalizedValue2 = Mocks.object('normalizedValue2');

      const instance = {[key1]: value1, [key2]: value2, constructor: ctor};

      const mockAnnotationHandler =
          jasmine.createSpyObj('AnnotationHandler', ['getAnnotatedProperties']);
      mockAnnotationHandler.getAnnotatedProperties.and.returnValue([key1, key2]);

      spyOn(ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotationHandler);
      spyOn(ANNOTATIONS, 'hasAnnotation').and.returnValue(true);

      const originalGrabFields = Stringify['grabFields_'];
      Fakes.build(spyOn(Stringify, 'grabFields_'))
          .when(value1).return(normalizedValue1)
          .when(value2).return(normalizedValue2)
          .else().call((instance: any): any => originalGrabFields(instance));

      assert(Stringify['grabFields_'](instance)).to.equal({
        [key1]: normalizedValue1,
        [key2]: normalizedValue2,
      });
      assert(Stringify['grabFields_']).to.haveBeenCalledWith(value1);
      assert(Stringify['grabFields_']).to.haveBeenCalledWith(value2);
      assert(ANNOTATIONS.forCtor).to.haveBeenCalledWith(ctor);
      assert(ANNOTATIONS.hasAnnotation).to.haveBeenCalledWith(ctor);
    });

    it('should normalize symbol keys correctly', () => {
      const ctor = Mocks.object('prototype');
      const key1 = Symbol('key1');
      const value1 = Mocks.object('value1');
      const normalizedValue1 = Mocks.object('normalizedValue1');
      const key2 = Symbol('key2');
      const value2 = Mocks.object('value2');
      const normalizedValue2 = Mocks.object('normalizedValue2');

      const instance = {[key1]: value1, [key2]: value2, constructor: ctor};

      const mockAnnotationHandler =
          jasmine.createSpyObj('AnnotationHandler', ['getAnnotatedProperties']);
      mockAnnotationHandler.getAnnotatedProperties.and.returnValue([key1, key2]);

      spyOn(ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotationHandler);
      spyOn(ANNOTATIONS, 'hasAnnotation').and.returnValue(true);

      const originalGrabFields = Stringify['grabFields_'];

      Fakes.build(spyOn(Stringify, 'grabFields_'))
          .when(value1).return(normalizedValue1)
          .when(value2).return(normalizedValue2)
          .else().call((instance: any): any => originalGrabFields(instance));

      assert(Stringify['grabFields_'](instance)).to.equal({
        [`[${key1.toString()}]`]: normalizedValue1,
        [`[${key2.toString()}]`]: normalizedValue2,
      });
      assert(Stringify['grabFields_']).to.haveBeenCalledWith(value1);
      assert(Stringify['grabFields_']).to.haveBeenCalledWith(value2);
      assert(ANNOTATIONS.forCtor).to.haveBeenCalledWith(ctor);
      assert(ANNOTATIONS.hasAnnotation).to.haveBeenCalledWith(ctor);
    });

    it('should return the instance if it is not an object', () => {
      const instance = 'instance';
      assert(Stringify['grabFields_'](instance)).to.equal(instance);
    });

    it('should return the instance if it does not have the annotation', () => {
      const ctor = Mocks.object('ctor');
      const instance = {constructor: ctor};
      spyOn(ANNOTATIONS, 'hasAnnotation').and.returnValue(false);

      assert(Stringify['grabFields_'](instance)).to.equal(instance);
      assert(ANNOTATIONS.hasAnnotation).to.haveBeenCalledWith(ctor);
    });
  });

  describe('Property', () => {
    it('should add the field to the annotations', () => {
      const mockAnnotationHandler =
          jasmine.createSpyObj('AnnotationHandler', ['attachValueToProperty']);
      const ctor = Mocks.object('ctor');
      const key = 'key';

      spyOn(ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotationHandler);

      Stringify.Property()(ctor, key);

      assert(ANNOTATIONS.forCtor).to.haveBeenCalledWith(Object);
      assert(mockAnnotationHandler.attachValueToProperty).to.haveBeenCalledWith(key, {});
    });
  });

  describe('toString', () => {
    it('should call toStringHelper_ correctly', () => {
      const delimiter = 'delimiter';
      const pad = 'pad';
      const field = Mocks.object('field');
      spyOn(Stringify, 'grabFields_').and.returnValue(field);

      const result = 'result';
      spyOn(Stringify, 'formatField_').and.returnValue(result);

      const instance = Mocks.object('instance');

      assert(Stringify.toString(instance, {delimiter, pad})).to.equal(result);
      assert(Stringify['formatField_']).to.haveBeenCalledWith(field, delimiter, pad);
      assert(Stringify['grabFields_']).to.haveBeenCalledWith(instance);
    });
  });
});

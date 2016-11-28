import {assert, TestBase} from '../test-base';
TestBase.setup();

import {ANNOTATIONS, Stringify} from './stringify';
import {Mocks} from '../mock/mocks';
import {Natives} from '../typescript/natives';


describe('data.Stringify', () => {
  describe('formatField_', () => {
    it('should stringify strings correctly', () => {
      assert(Stringify['formatField_']('abc', '|', '--', '>>')).to.equal('"abc"');
    });

    it('should stringify native values correctly', () => {
      let field = 123;
      spyOn(Natives, 'isNative').and.returnValue(true);
      assert(Stringify['formatField_'](field, '|', '--', '>>')).to.equal(`${field}`);
      assert(Natives.isNative).to.haveBeenCalledWith(field);
    });

    it('should stringify Dates correctly', () => {
      let date = new Date(123);
      assert(Stringify['formatField_'](date, '|', '--')).to.equal(date.toLocaleString());
    });

    it('should stringify Functions correctly', () => {
      let f = function a(a: any, b: any, c: any): any {};
      assert(Stringify['formatField_'](f, '|', '--', '>>')).to.equal('function a(a, b, c)');
    });

    it('should stringify objects correctly without padding', () => {
      let key1 = 'key1';
      let value1 = Mocks.object('value1');
      let key2 = 'key2';
      let value2 = Mocks.object('value2');

      let instance = {[key1]: value1, [key2]: value2};

      let stringifiedValue1 = 'stringifiedValue1';
      let stringifiedValue2 = 'stringifiedValue2';
      let originalFormatField_ = Stringify['formatField_'];
      spyOn(Stringify, 'formatField_').and.callFake((
          field: any,
          delimiter: string,
          pad: string,
          indent: string) => {
        switch (field) {
          case value1:
            return stringifiedValue1;
          case value2:
            return stringifiedValue2;
          default:
            return originalFormatField_(field, delimiter, pad, indent);
        }
      });

      let result = Stringify['formatField_'](instance, '|', '', '>>');
      assert(result).to.equal(`{${key1}: ${stringifiedValue1}|${key2}: ${stringifiedValue2}}`);
    });

    it('should stringify objects correctly with padding', () => {
      let key1 = 'key1';
      let value1 = Mocks.object('value1');
      let key2 = 'key2';
      let value2 = Mocks.object('value2');

      let instance = {[key1]: value1, [key2]: value2};

      let stringifiedValue1 = 'stringifiedValue1';
      let stringifiedValue2 = 'stringifiedValue2';
      let originalFormatField_ = Stringify['formatField_'];
      spyOn(Stringify, 'formatField_').and.callFake((
          field: any,
          delimiter: string,
          pad: string,
          indent: string) => {
        switch (field) {
          case value1:
            return stringifiedValue1;
          case value2:
            return stringifiedValue2;
          default:
            return originalFormatField_(field, delimiter, pad, indent);
        }
      });

      let result = Stringify['formatField_'](instance, '|', '--', '>>');
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
      let ctor = Mocks.object('ctor');
      let key1 = 'key1';
      let value1 = Mocks.object('value1');
      let normalizedValue1 = Mocks.object('normalizedValue1');
      let key2 = 'key2';
      let value2 = Mocks.object('value2');
      let normalizedValue2 = Mocks.object('normalizedValue2');

      let instance = {[key1]: value1, [key2]: value2, constructor: ctor};

      let mockAnnotationHandler =
          jasmine.createSpyObj('AnnotationHandler', ['getAnnotatedProperties']);
      mockAnnotationHandler.getAnnotatedProperties.and.returnValue([key1, key2]);

      spyOn(ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotationHandler);
      spyOn(ANNOTATIONS, 'hasAnnotation').and.returnValue(true);

      let originalGrabFields = Stringify['grabFields_'];
      spyOn(Stringify, 'grabFields_').and.callFake((instance: any): any => {
        switch (instance) {
          case value1:
            return normalizedValue1;
          case value2:
            return normalizedValue2;
          default:
            return originalGrabFields(instance);
        }
      });

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
      let ctor = Mocks.object('prototype');
      let key1 = Symbol('key1');
      let value1 = Mocks.object('value1');
      let normalizedValue1 = Mocks.object('normalizedValue1');
      let key2 = Symbol('key2');
      let value2 = Mocks.object('value2');
      let normalizedValue2 = Mocks.object('normalizedValue2');

      let instance = {[key1]: value1, [key2]: value2, constructor: ctor};

      let mockAnnotationHandler =
          jasmine.createSpyObj('AnnotationHandler', ['getAnnotatedProperties']);
      mockAnnotationHandler.getAnnotatedProperties.and.returnValue([key1, key2]);

      spyOn(ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotationHandler);
      spyOn(ANNOTATIONS, 'hasAnnotation').and.returnValue(true);

      let originalGrabFields = Stringify['grabFields_'];
      spyOn(Stringify, 'grabFields_').and.callFake((instance: any): any => {
        switch (instance) {
          case value1:
            return normalizedValue1;
          case value2:
            return normalizedValue2;
          default:
            return originalGrabFields(instance);
        }
      });

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
      let instance = 'instance';
      assert(Stringify['grabFields_'](instance)).to.equal(instance);
    });

    it('should return the instance if it does not have the annotation', () => {
      let ctor = Mocks.object('ctor');
      let instance = {constructor: ctor};
      spyOn(ANNOTATIONS, 'hasAnnotation').and.returnValue(false);

      assert(Stringify['grabFields_'](instance)).to.equal(instance);
      assert(ANNOTATIONS.hasAnnotation).to.haveBeenCalledWith(ctor);
    });
  });

  describe('Property', () => {
    it('should add the field to the annotations', () => {
      let mockAnnotationHandler =
          jasmine.createSpyObj('AnnotationHandler', ['attachValueToProperty']);
      let ctor = Mocks.object('ctor');
      let key = 'key';

      spyOn(ANNOTATIONS, 'forCtor').and.returnValue(mockAnnotationHandler);

      Stringify.Property()(ctor, key);

      assert(ANNOTATIONS.forCtor).to.haveBeenCalledWith(Object);
      assert(mockAnnotationHandler.attachValueToProperty).to.haveBeenCalledWith(key, {});
    });
  });

  describe('toString', () => {
    it('should call toStringHelper_ correctly', () => {
      let delimiter = 'delimiter';
      let pad = 'pad';
      let field = Mocks.object('field');
      spyOn(Stringify, 'grabFields_').and.returnValue(field);

      let result = 'result';
      spyOn(Stringify, 'formatField_').and.returnValue(result);

      let instance = Mocks.object('instance');

      assert(Stringify.toString(instance, {delimiter, pad})).to.equal(result);
      assert(Stringify['formatField_']).to.haveBeenCalledWith(field, delimiter, pad);
      assert(Stringify['grabFields_']).to.haveBeenCalledWith(instance);
    });
  });
});

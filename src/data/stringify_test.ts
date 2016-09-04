import {TestBase} from '../test-base';
TestBase.setup();

import {__STRINGIFY, Stringify} from './stringify';
import {Annotations} from './annotations';
import {Maps} from '../collection/maps';
import {Mocks} from '../mock/mocks';
import {Natives} from '../typescript/natives';


describe('data.Stringify', () => {
  describe('formatField_', () => {
    it('should stringify strings correctly', () => {
      expect(Stringify['formatField_']('abc', '|', '--', '>>')).toEqual('"abc"');
    });

    it('should stringify native values correctly', () => {
      let field = 123;
      spyOn(Natives, 'isNative').and.returnValue(true);
      expect(Stringify['formatField_'](field, '|', '--', '>>')).toEqual(`${field}`);
      expect(Natives.isNative).toHaveBeenCalledWith(field);
    });

    it('should stringify Dates correctly', () => {
      let date = new Date(123);
      expect(Stringify['formatField_'](date, '|', '--')).toEqual(date.toLocaleString());
    });

    it('should stringify Functions correctly', () => {
      let f = function a(a: any, b: any, c: any): any {};
      expect(Stringify['formatField_'](f, '|', '--', '>>')).toEqual('function a(a, b, c)');
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
      expect(result).toEqual(`{${key1}: ${stringifiedValue1}|${key2}: ${stringifiedValue2}}`);
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
      expect(result).toEqual([
        '{',
        `-->>${key1}: ${stringifiedValue1}|`,
        `-->>${key2}: ${stringifiedValue2}`,
        '>>}',
      ].join('\n'));
    });
  });

  describe('grabFields_', () => {
    it('should grab all the fields with stringify annotation', () => {
      let proto = Mocks.object('prototype');
      let key1 = 'key1';
      let value1 = Mocks.object('value1');
      let normalizedValue1 = Mocks.object('normalizedValue1');
      let key2 = 'key2';
      let value2 = Mocks.object('value2');
      let normalizedValue2 = Mocks.object('normalizedValue2');

      let instance = {[key1]: value1, [key2]: value2, constructor: {prototype: proto}};

      let mockAnnotations = jasmine.createSpyObj('Annotations', ['getFieldValues']);
      mockAnnotations.getFieldValues.and
          .returnValue(Maps.fromRecord({[key1]: value1, [key2]: value2}).asMap());
      spyOn(Annotations, 'of').and.returnValue(mockAnnotations);
      spyOn(Annotations, 'hasAnnotation').and.returnValue(true);

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

      expect(Stringify['grabFields_'](instance)).toEqual({
        [key1]: normalizedValue1,
        [key2]: normalizedValue2,
      });
      expect(Stringify['grabFields_']).toHaveBeenCalledWith(value1);
      expect(Stringify['grabFields_']).toHaveBeenCalledWith(value2);
      expect(mockAnnotations.getFieldValues).toHaveBeenCalledWith(instance);
      expect(Annotations.of).toHaveBeenCalledWith(proto, __STRINGIFY);
      expect(Annotations.hasAnnotation).toHaveBeenCalledWith(proto, __STRINGIFY);
    });

    it('should normalize symbol keys correctly', () => {
      let proto = Mocks.object('prototype');
      let key1 = Symbol('key1');
      let value1 = Mocks.object('value1');
      let normalizedValue1 = Mocks.object('normalizedValue1');
      let key2 = Symbol('key2');
      let value2 = Mocks.object('value2');
      let normalizedValue2 = Mocks.object('normalizedValue2');

      let instance = {[key1]: value1, [key2]: value2, constructor: {prototype: proto}};

      let mockAnnotations = jasmine.createSpyObj('Annotations', ['getFieldValues']);
      let map = new Map<symbol, any>();
      map.set(key1, value1);
      map.set(key2, value2);
      mockAnnotations.getFieldValues.and.returnValue(map);
      spyOn(Annotations, 'of').and.returnValue(mockAnnotations);
      spyOn(Annotations, 'hasAnnotation').and.returnValue(true);

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

      expect(Stringify['grabFields_'](instance)).toEqual({
        [`[${key1.toString()}]`]: normalizedValue1,
        [`[${key2.toString()}]`]: normalizedValue2,
      });
      expect(Stringify['grabFields_']).toHaveBeenCalledWith(value1);
      expect(Stringify['grabFields_']).toHaveBeenCalledWith(value2);
      expect(mockAnnotations.getFieldValues).toHaveBeenCalledWith(instance);
      expect(Annotations.of).toHaveBeenCalledWith(proto, __STRINGIFY);
      expect(Annotations.hasAnnotation).toHaveBeenCalledWith(proto, __STRINGIFY);
    });

    it('should return the instance if it is not an object', () => {
      let instance = 'instance';
      expect(Stringify['grabFields_'](instance)).toEqual(instance);
    });

    it('should return the instance if it does not have the annotation', () => {
      let proto = Mocks.object('prototype');
      let instance = {constructor: {prototype: proto}};
      spyOn(Annotations, 'hasAnnotation').and.returnValue(false);

      expect(Stringify['grabFields_'](instance)).toEqual(instance);
      expect(Annotations.hasAnnotation).toHaveBeenCalledWith(proto, __STRINGIFY);
    });
  });

  describe('Property', () => {
    it('should add the field to the annotations', () => {
      let mockAnnotations = jasmine.createSpyObj('Annotations', ['addField']);
      let ctor = Mocks.object('ctor');
      let key = 'key';

      spyOn(Annotations, 'of').and.returnValue(mockAnnotations);

      Stringify.Property()(ctor, key);

      expect(mockAnnotations.addField).toHaveBeenCalledWith(key);
      expect(Annotations.of).toHaveBeenCalledWith(ctor, __STRINGIFY);
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

      expect(Stringify.toString(instance, {delimiter, pad})).toEqual(result);
      expect(Stringify['formatField_']).toHaveBeenCalledWith(field, delimiter, pad);
      expect(Stringify['grabFields_']).toHaveBeenCalledWith(instance);
    });
  });
});

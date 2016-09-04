import {TestBase} from '../test-base';
TestBase.setup();

import {__STRINGIFY, Stringify} from './stringify';
import {Annotations} from './annotations';
import {Maps} from '../collection/maps';
import {Mocks} from '../mock/mocks';


describe('data.Stringify', () => {
  describe('toStringHelper_', () => {
    it('should stringify functions correctly', () => {
      let f = function a(a: any, b: any, c: any): any {};
      let result = Stringify['toStringHelper_'](
          f,
          undefined,
          undefined,
          undefined,
          '   ');
      expect(result).toEqual('   function a(a, b, c)');
    });

    it('should stringify objects with annotation correctly for multiline', () => {
      let key1 = 'key1';
      let value1 = Mocks.object('value1');
      let key2 = 'key2';
      let value2 = Mocks.object('value2');

      let ctor = Mocks.object('ctor');
      let instance = {[key1]: value1, [key2]: value2, constructor: ctor};

      let delimiter = '|';
      let multiline = true;
      let pad = '-';
      let indent = '>>';

      let mockAnnotations = jasmine.createSpyObj('Annotations', ['getFieldValues']);
      mockAnnotations.getFieldValues.and
          .returnValue(Maps.fromRecord({[key1]: value1, [key2]: value2}).asMap());

      spyOn(Annotations, 'of').and.returnValue(mockAnnotations);
      spyOn(Annotations, 'hasAnnotation').and.returnValue(true);

      let stringifiedValue1 = 'stringifiedValue1';
      let stringifiedValue2 = 'stringifiedValue2';
      let originalToStringHelper_ = Stringify['toStringHelper_'];
      spyOn(Stringify, 'toStringHelper_').and.callFake((
          instance: any,
          delimiter: string,
          multiline: boolean,
          pad: string,
          indent: string) => {
        switch (instance) {
          case value1:
            return stringifiedValue1;
          case value2:
            return stringifiedValue2;
          default:
            return originalToStringHelper_(instance, delimiter, multiline, pad, indent);
        }
      });

      let result = Stringify['toStringHelper_'](instance, delimiter, multiline, pad, indent);
      expect(result).toEqual(
`>>{
>>-${key1}: ${stringifiedValue1}|
>>-${key2}: ${stringifiedValue2}
>>}`
          );
      expect(Stringify['toStringHelper_'])
          .toHaveBeenCalledWith(value1, delimiter, multiline, pad, pad + indent);
      expect(Stringify['toStringHelper_'])
          .toHaveBeenCalledWith(value2, delimiter, multiline, pad, pad + indent);
      expect(mockAnnotations.getFieldValues).toHaveBeenCalledWith(instance);
      expect(Annotations.of).toHaveBeenCalledWith(ctor, __STRINGIFY);
      expect(Annotations.hasAnnotation).toHaveBeenCalledWith(ctor, __STRINGIFY);
    });

    it('should stringify objects with annotation correctly for single line', () => {
      let key1 = 'key1';
      let value1 = Mocks.object('value1');
      let key2 = 'key2';
      let value2 = Mocks.object('value2');

      let ctor = Mocks.object('ctor');
      let instance = {[key1]: value1, [key2]: value2, constructor: ctor};

      let mockAnnotations = jasmine.createSpyObj('Annotations', ['getFieldValues']);
      mockAnnotations.getFieldValues.and
          .returnValue(Maps.fromRecord({[key1]: value1, [key2]: value2}).asMap());

      spyOn(Annotations, 'of').and.returnValue(mockAnnotations);
      spyOn(Annotations, 'hasAnnotation').and.returnValue(true);

      let stringifiedValue1 = 'stringifiedValue1';
      let stringifiedValue2 = 'stringifiedValue2';
      let originalToStringHelper_ = Stringify['toStringHelper_'];
      spyOn(Stringify, 'toStringHelper_').and.callFake((
          instance: any,
          delimiter: string,
          multiline: boolean,
          pad: string,
          indent: string) => {
        switch (instance) {
          case value1:
            return stringifiedValue1;
          case value2:
            return stringifiedValue2;
          default:
            return originalToStringHelper_(instance, delimiter, multiline, pad, indent);
        }
      });

      let result = Stringify['toStringHelper_'](instance, '|', false);
      expect(result).toEqual(`{${key1}: ${stringifiedValue1}|${key2}: ${stringifiedValue2}}`);
    });

    it('should stringify numbers correctly', () => {
      let result = Stringify['toStringHelper_'](
          123,
          undefined,
          undefined,
          undefined,
          '   ');
      expect(result).toEqual('   123');
    });

    it('should stringify Dates correctly', () => {
      let date = new Date(123);
      let result = Stringify['toStringHelper_'](
          date,
          undefined,
          undefined,
          undefined,
          '   ');
      expect(result).toEqual(`   ${date}`);
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
      let multiline = true;
      let pad = 'pad';
      let result = 'result';
      spyOn(Stringify, 'toStringHelper_').and.returnValue(result);

      let instance = Mocks.object('instance');

      expect(Stringify.toString(instance, {delimiter, multiline, pad})).toEqual(result);
      expect(Stringify['toStringHelper_'])
          .toHaveBeenCalledWith(instance, delimiter, multiline, pad);
    });
  });
});

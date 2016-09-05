import {TestBase} from '../test-base';
TestBase.setup();

import {__EQUALS, Equals} from './equals';
import {Annotations} from './annotations';
import {Maps} from '../collection/maps';
import {Mocks} from '../mock/mocks';


describe('data.Equals', () => {
  describe('equals', () => {
    it('should recursively check the fields', () => {
      let proto = Mocks.object('proto');
      let a = {constructor: {prototype: proto}};
      let b = Mocks.object('b');

      let key1 = 'key1';
      let value1A = Mocks.object('value1A');
      let value1B = Mocks.object('value1B');
      let key2 = 'key2';
      let value2A = Mocks.object('value2A');
      let value2B = Mocks.object('value2B');
      let fieldsA = Maps.fromRecord({[key1]: value1A, [key2]: value2A}).asMap();
      let fieldsB = Maps.fromRecord({[key1]: value1B, [key2]: value2B}).asMap();

      let mockAnnotations = jasmine.createSpyObj('Annotations', ['getFieldValues']);
      mockAnnotations.getFieldValues.and.callFake((instance: any): any => {
        switch (instance) {
          case a:
            return fieldsA;
          case b:
            return fieldsB;
        }
      });
      spyOn(Annotations, 'of').and.returnValue(mockAnnotations);
      spyOn(Annotations, 'hasAnnotation').and.returnValue(true);

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

      expect(Equals.equals(a, b)).toEqual(true);
      expect(Equals.equals).toHaveBeenCalledWith(value1A, value1B);
      expect(Equals.equals).toHaveBeenCalledWith(value2A, value2B);
      expect(mockAnnotations.getFieldValues).toHaveBeenCalledWith(a);
      expect(mockAnnotations.getFieldValues).toHaveBeenCalledWith(b);
      expect(Annotations.of).toHaveBeenCalledWith(proto, __EQUALS);
      expect(Annotations.hasAnnotation).toHaveBeenCalledWith(proto, __EQUALS);
    });

    it('should return false if one of the recursive fields is different', () => {
      let proto = Mocks.object('proto');
      let a = {constructor: {prototype: proto}};
      let b = Mocks.object('b');

      let key1 = 'key1';
      let value1A = Mocks.object('value1A');
      let value1B = Mocks.object('value1B');
      let key2 = 'key2';
      let value2A = Mocks.object('value2A');
      let value2B = Mocks.object('value2B');

      let mockAnnotations = jasmine.createSpyObj('Annotations', ['getFieldValues']);
      mockAnnotations.getFieldValues.and.callFake((instance: any): any => {
        switch (instance) {
          case a:
            return Maps.fromRecord({[key1]: value1A, [key2]: value2A}).asMap();
          case b:
            return Maps.fromRecord({[key1]: value1B, [key2]: value2B}).asMap();
        }
      });
      spyOn(Annotations, 'of').and.returnValue(mockAnnotations);
      spyOn(Annotations, 'hasAnnotation').and.returnValue(true);

      let originalEquals = Equals.equals;
      spyOn(Equals, 'equals').and.callFake((a: any, b: any): boolean => {
        switch (a) {
          case value1A:
            return true;
          case value2A:
            return false;
          default:
            return originalEquals(a, b);
        }
      });

      expect(Equals.equals(a, b)).toEqual(false);
    });

    it('should use === for values with no annotations', () => {
      let object = Mocks.object('object');
      let a = object;
      let b = object;
      let other = Mocks.object('object');

      spyOn(Annotations, 'hasAnnotation').and.returnValue(false);

      expect(Equals.equals(a, b)).toEqual(true);
      expect(Equals.equals(a, other)).toEqual(false);
    });

    it('should use === for values that are not Objects', () => {
      let a = 123;
      let b = 123;
      let other = 456;

      expect(Equals.equals(a, b)).toEqual(true);
      expect(Equals.equals(a, other)).toEqual(false);
    });
  });

  describe('Property', () => {
    it('should add the field correctly', () => {
      let proto = Mocks.object('proto');
      let key = 'key';
      let mockAnnotations = jasmine.createSpyObj('Annotations', ['addField']);
      spyOn(Annotations, 'of').and.returnValue(mockAnnotations);

      Equals.Property()(proto, key);

      expect(mockAnnotations.addField).toHaveBeenCalledWith(key);
      expect(Annotations.of).toHaveBeenCalledWith(proto, __EQUALS);
    });
  });
});

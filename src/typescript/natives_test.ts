import {TestBase} from '../test-base';
TestBase.setup();

import {Mocks} from '../mock/mocks';
import {Natives} from './natives';


describe('typescript.Natives', () => {
  describe('isBoolean', () => {
    it('should return true if the value is a native boolean', () => {
      expect(Natives.isBoolean(false)).toEqual(true);
    });

    it('should return true if the value is a Boolean object', () => {
      expect(Natives.isBoolean(Boolean(false))).toEqual(true);
    });

    it('should return false otherwise', () => {
      expect(Natives.isBoolean(123)).toEqual(false);
    });
  });

  describe('isNative', () => {
    it('should return true if the value is a boolean', () => {
      let value = Mocks.object('value');
      spyOn(Natives, 'isBoolean').and.returnValue(true);
      expect(Natives.isNative(value)).toEqual(true);
      expect(Natives.isBoolean).toHaveBeenCalledWith(value);
    });

    it('should return true if the value is a number', () => {
      let value = Mocks.object('value');
      spyOn(Natives, 'isBoolean').and.returnValue(false);
      spyOn(Natives, 'isNumber').and.returnValue(true);

      expect(Natives.isNative(value)).toEqual(true);
      expect(Natives.isBoolean).toHaveBeenCalledWith(value);
      expect(Natives.isNumber).toHaveBeenCalledWith(value);
    });

    it('should return true if the value is a string', () => {
      let value = Mocks.object('value');
      spyOn(Natives, 'isBoolean').and.returnValue(false);
      spyOn(Natives, 'isNumber').and.returnValue(false);
      spyOn(Natives, 'isString').and.returnValue(true);

      expect(Natives.isNative(value)).toEqual(true);
      expect(Natives.isBoolean).toHaveBeenCalledWith(value);
      expect(Natives.isNumber).toHaveBeenCalledWith(value);
      expect(Natives.isString).toHaveBeenCalledWith(value);
    });

    it('should return true if the value is a symbol', () => {
      let value = Mocks.object('value');
      spyOn(Natives, 'isBoolean').and.returnValue(false);
      spyOn(Natives, 'isNumber').and.returnValue(false);
      spyOn(Natives, 'isString').and.returnValue(false);
      spyOn(Natives, 'isSymbol').and.returnValue(true);

      expect(Natives.isNative(value)).toEqual(true);
      expect(Natives.isBoolean).toHaveBeenCalledWith(value);
      expect(Natives.isNumber).toHaveBeenCalledWith(value);
      expect(Natives.isString).toHaveBeenCalledWith(value);
      expect(Natives.isSymbol).toHaveBeenCalledWith(value);
    });

    it('should return false otherwise', () => {
      let value = Mocks.object('value');
      spyOn(Natives, 'isBoolean').and.returnValue(false);
      spyOn(Natives, 'isNumber').and.returnValue(false);
      spyOn(Natives, 'isString').and.returnValue(false);
      spyOn(Natives, 'isSymbol').and.returnValue(false);

      expect(Natives.isNative(value)).toEqual(false);
      expect(Natives.isBoolean).toHaveBeenCalledWith(value);
      expect(Natives.isNumber).toHaveBeenCalledWith(value);
      expect(Natives.isString).toHaveBeenCalledWith(value);
      expect(Natives.isSymbol).toHaveBeenCalledWith(value);
    });
  });

  describe('isNumber', () => {
    it('should return true if the value is a native number', () => {
      expect(Natives.isNumber(123)).toEqual(true);
    });

    it('should return true if the value is a Number object', () => {
      expect(Natives.isNumber(Number(123))).toEqual(true);
    });

    it('should return false otherwise', () => {
      expect(Natives.isNumber('string')).toEqual(false);
    });
  });

  describe('isString', () => {
    it('should return true if the value is a native string', () => {
      expect(Natives.isString('string')).toEqual(true);
    });

    it('should return true if the value is a String object', () => {
      expect(Natives.isString(String('string'))).toEqual(true);
    });

    it('should return false otherwise', () => {
      expect(Natives.isString(Symbol('symbol'))).toEqual(false);
    });
  });

  describe('isSymbol', () => {
    it('should return true if the value is a symbol', () => {
      expect(Natives.isSymbol(Symbol('symbol'))).toEqual(true);
    });

    it('should return false otherwise', () => {
      expect(Natives.isSymbol(true)).toEqual(false);
    });
  });
});

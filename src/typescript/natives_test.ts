import {assert, TestBase, verify} from '../test-base';
TestBase.setup();

import {Mocks} from '../mock/mocks';
import {Natives} from './natives';


describe('typescript.Natives', () => {
  describe('isBoolean', () => {
    it('should return true if the value is a native boolean', () => {
      assert(Natives.isBoolean(false)).to.beTrue();
    });

    it('should return true if the value is a Boolean object', () => {
      assert(Natives.isBoolean(Boolean(false))).to.beTrue();
    });

    it('should return false otherwise', () => {
      assert(Natives.isBoolean(123)).to.beFalse();
    });
  });

  describe('isNative', () => {
    it('should return true if the value is a boolean', () => {
      let value = Mocks.object('value');
      spyOn(Natives, 'isBoolean').and.returnValue(true);

      // We cannot use assert, since assert relies on Natives.
      expect(Natives.isNative(value)).toEqual(true);
      verify(Natives.isBoolean)(value);
    });

    it('should return true if the value is a number', () => {
      let value = Mocks.object('value');
      spyOn(Natives, 'isBoolean').and.returnValue(false);
      spyOn(Natives, 'isNumber').and.returnValue(true);

      // We cannot use assert, since assert relies on Natives.
      expect(Natives.isNative(value)).toEqual(true);
      verify(Natives.isBoolean)(value);
      verify(Natives.isNumber)(value);
    });

    it('should return true if the value is a string', () => {
      let value = Mocks.object('value');
      spyOn(Natives, 'isBoolean').and.returnValue(false);
      spyOn(Natives, 'isNumber').and.returnValue(false);
      spyOn(Natives, 'isString').and.returnValue(true);

      // We cannot use assert, since assert relies on Natives.
      expect(Natives.isNative(value)).toEqual(true);
      verify(Natives.isBoolean)(value);
      verify(Natives.isNumber)(value);
      verify(Natives.isString)(value);
    });

    it('should return true if the value is a symbol', () => {
      let value = Mocks.object('value');
      spyOn(Natives, 'isBoolean').and.returnValue(false);
      spyOn(Natives, 'isNumber').and.returnValue(false);
      spyOn(Natives, 'isString').and.returnValue(false);
      spyOn(Natives, 'isSymbol').and.returnValue(true);

      // We cannot use assert, since assert relies on Natives.
      expect(Natives.isNative(value)).toEqual(true);
      verify(Natives.isBoolean)(value);
      verify(Natives.isNumber)(value);
      verify(Natives.isString)(value);
      verify(Natives.isSymbol)(value);
    });

    it('should return false otherwise', () => {
      let value = Mocks.object('value');
      spyOn(Natives, 'isBoolean').and.returnValue(false);
      spyOn(Natives, 'isNumber').and.returnValue(false);
      spyOn(Natives, 'isString').and.returnValue(false);
      spyOn(Natives, 'isSymbol').and.returnValue(false);

      // We cannot use assert, since assert relies on Natives.
      expect(Natives.isNative(value)).toEqual(false);
      verify(Natives.isBoolean)(value);
      verify(Natives.isNumber)(value);
      verify(Natives.isString)(value);
      verify(Natives.isSymbol)(value);
    });
  });

  describe('isNumber', () => {
    it('should return true if the value is a native number', () => {
      assert(Natives.isNumber(123)).to.beTrue();
    });

    it('should return true if the value is a Number object', () => {
      assert(Natives.isNumber(Number(123))).to.beTrue();
    });

    it('should return false otherwise', () => {
      assert(Natives.isNumber('string')).to.beFalse();
    });
  });

  describe('isString', () => {
    it('should return true if the value is a native string', () => {
      assert(Natives.isString('string')).to.beTrue();
    });

    it('should return true if the value is a String object', () => {
      assert(Natives.isString(String('string'))).to.beTrue();
    });

    it('should return false otherwise', () => {
      assert(Natives.isString(Symbol('symbol'))).to.beFalse();
    });
  });

  describe('isSymbol', () => {
    it('should return true if the value is a symbol', () => {
      assert(Natives.isSymbol(Symbol('symbol'))).to.beTrue();
    });

    it('should return false otherwise', () => {
      assert(Natives.isSymbol(true)).to.beFalse();
    });
  });
});

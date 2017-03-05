import { TestBase } from '../test-base';
TestBase.setup();

import { NativeType } from '../check/native-type';


describe('check.NativeType', () => {
  describe('isNative', () => {
    it('should return true if the value is a boolean', () => {
      // We cannot use assert, since assert relies on NativeType.
      expect(NativeType.check(true)).toEqual(true);
    });

    it('should return true if the value is a number', () => {
      // We cannot use assert, since assert relies on NativeType.
      expect(NativeType.check(123)).toEqual(true);
    });

    it('should return true if the value is a string', () => {
      // We cannot use assert, since assert relies on NativeType.
      expect(NativeType.check('value')).toEqual(true);
    });

    it('should return true if the value is a symbol', () => {
      // We cannot use assert, since assert relies on NativeType.
      expect(NativeType.check(Symbol('symbol'))).toEqual(true);
    });

    it('should return false otherwise', () => {
      // We cannot use assert, since assert relies on NativeType.
      expect(NativeType.check({})).toEqual(false);
    });
  });
});

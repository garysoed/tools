import { assert, TestBase } from '../test-base';
TestBase.setup();

import { SymbolType } from '../check/symbol-type';


describe('check.SymbolType', () => {
  describe('isSymbol', () => {
    it('should return true if the value is a symbol', () => {
      assert(SymbolType.check(Symbol('symbol'))).to.beTrue();
    });

    it('should return false otherwise', () => {
      assert(SymbolType.check(true)).to.beFalse();
    });
  });
});

import { assert, TestBase } from '../test-base';
TestBase.setup();

import { FunctionParser } from '../parse';


describe('parse.FunctionParser', () => {
  describe('parse', () => {
    it(`should return the correct function`, () => {
      const fnString = 'function test(a) { return 1 + a; }';
      const parser = FunctionParser.oneParam();

      assert(parser.parse(fnString)!(3)).to.equal(4);
    });

    it(`should return null if the param count does not match`, () => {
      const fnString = 'function test(a) { return 1 + a; }';
      const parser = FunctionParser.noParam();

      assert(parser.parse(fnString)).to.beNull();
    });

    it(`should handle any number of param counts`, () => {
      const fnString = 'function test(a) { return 1 + a; }';
      const parser = FunctionParser.anyParams();

      assert(parser.parse(fnString)!(2)).to.equal(3);
    });

    it(`should return null if not a function`, () => {
      const fnString = '123';
      const parser = FunctionParser.anyParams();

      assert(parser.parse(fnString)).to.beNull();
    });

    it(`should return null for null inputs`, () => {
      const parser = FunctionParser.anyParams();

      assert(parser.parse(null)).to.beNull();
    });
  });

  describe('stringify', () => {
    it(`should return the correct value`, () => {
      const fn = function test(a: any) { return 1 + a; };
      const parser = FunctionParser.oneParam();

      assert(parser.stringify(fn)).to.equal('function test(a) { return 1 + a; }');
    });

    it(`should return '' if param count does not match`, () => {
      const fn = function test() { return 1; };
      const parser = FunctionParser.oneParam();

      assert(parser.stringify(fn)).to.equal('');
    });

    it(`should handle any number of params`, () => {
      const fn = function test(a: any) { return 1 + a; };
      const parser = FunctionParser.anyParams();

      assert(parser.stringify(fn)).to.equal('function test(a) { return 1 + a; }');
    });

    it(`should return empty string if null`, () => {
      const parser = FunctionParser.anyParams();

      assert(parser.stringify(null)).to.equal('');
    });
  });
});

import { assert, should } from 'gs-testing/export/main';

import { FunctionParser } from './function-parser';


describe('parse.FunctionParser', () => {
  describe('parse', () => {
    should(`return the correct function`, () => {
      const fnString = 'function test(a) { return 1 + a; }';
      const parser = FunctionParser.oneParam();

      // tslint:disable-next-line:no-non-null-assertion
      assert(parser.convertBackward(fnString)!(3)).to.equal(4);
    });

    should(`return null if the param count does not match`, () => {
      const fnString = 'function test(a) { return 1 + a; }';
      const parser = FunctionParser.noParam();

      assert(parser.convertBackward(fnString)).to.beNull();
    });

    should(`handle any number of param counts`, () => {
      const fnString = 'function test(a) { return 1 + a; }';
      const parser = FunctionParser.anyParams();

      // tslint:disable-next-line:no-non-null-assertion
      assert(parser.convertBackward(fnString)!(2)).to.equal(3);
    });

    should(`return null if not a function`, () => {
      const fnString = '123';
      const parser = FunctionParser.anyParams();

      assert(parser.convertBackward(fnString)).to.beNull();
    });

    should(`return null for null inputs`, () => {
      const parser = FunctionParser.anyParams();

      assert(parser.convertBackward(null)).to.beNull();
    });
  });

  describe('stringify', () => {
    should(`return the correct value`, () => {
      const fn = function test(a: any): any { return a + 1; };
      const parser = FunctionParser.oneParam();

      assert(parser.convertForward(fn)).to.equal('function test(a) { return a + 1; }');
    });

    should(`return '' if param count does not match`, () => {
      const fn = function test(): number { return 1; };
      const parser = FunctionParser.oneParam();

      assert(parser.convertForward(fn)).to.equal('');
    });

    should(`handle any number of params`, () => {
      const fn = function test(a: any): any { return a + 1; };
      const parser = FunctionParser.anyParams();

      assert(parser.convertForward(fn)).to.equal('function test(a) { return a + 1; }');
    });

    should(`return empty string if null`, () => {
      const parser = FunctionParser.anyParams();

      assert(parser.convertForward(null)).to.equal('');
    });
  });
});

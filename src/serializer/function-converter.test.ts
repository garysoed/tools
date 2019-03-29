import { assert, match, should, test } from '@gs-testing/main';
import { anyParamsFunctionConverter, noParamFunctionConverter, oneParamFunctionConverter } from './function-converter';

test('serializer.FunctionConverter', () => {
  test('convertBackward', () => {
    should(`return the correct function`, () => {
      const fnString = 'function test(a) { return 1 + a; }';
      const parser = oneParamFunctionConverter();

      const result = parser.convertBackward(fnString) as {result: Function};
      assert(result.result(3)).to.equal(4);
    });

    should(`fail if the param count does not match`, () => {
      const fnString = 'function test(a) { return 1 + a; }';
      const parser = noParamFunctionConverter();

      assert(parser.convertBackward(fnString)).to.haveProperties({success: false});
    });

    should(`handle any number of param counts`, () => {
      const fnString = 'function test(a) { return 1 + a; }';
      const parser = anyParamsFunctionConverter();

      const result = parser.convertBackward(fnString) as {result: Function};
      assert(result.result(2)).to.equal(3);
    });

    should(`fail if not a function`, () => {
      const fnString = '123';
      const parser = anyParamsFunctionConverter();

      assert(parser.convertBackward(fnString)).to.haveProperties({success: false});
    });

    should(`fail for non string inputs`, () => {
      const parser = anyParamsFunctionConverter();

      assert(parser.convertBackward(123)).to.haveProperties({success: false});
    });
  });

  test('convertForward', () => {
    should(`return the correct value`, () => {
      const fn = function test(a: any): any { return a + 1; };
      const parser = oneParamFunctionConverter();

      assert(parser.convertForward(fn)).to
          .haveProperties({
            result: match.anyStringThat().match(/function test\(a\)/),
          });
    });

    should(`fail if param count does not match`, () => {
      const fn = function test(): number { return 1; };
      const parser = oneParamFunctionConverter();

      assert(parser.convertForward(fn)).to.haveProperties({success: false});
    });

    should(`handle any number of params`, () => {
      const fn = function test(a: any): any { return a + 1; };
      const parser = anyParamsFunctionConverter();

      assert(parser.convertForward(fn)).to
          .haveProperties({
            result: match.anyStringThat().match(/function test\(a\)/),
          });
    });
  });
});

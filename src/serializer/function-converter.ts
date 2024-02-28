import {Converter, Result} from 'nabu';

class FunctionConverter<F extends (...args: any[]) => unknown>
  implements Converter<F, unknown>
{
  constructor(private readonly paramCount_: number | null) {}

  convertBackward(input: unknown): Result<F> {
    if (typeof input !== 'string') {
      return {success: false};
    }

    const expr = `(${input})`;
    /* tslint:disable:no-eval */
    const fn = eval(expr);
    /* tslint:enable:no-eval */

    if (!(fn instanceof Function)) {
      return {success: false};
    }

    if (this.paramCount_ !== null && fn.length !== this.paramCount_) {
      return {success: false};
    }

    return {result: fn, success: true};
  }

  convertForward(value: F): Result<unknown> {
    if (this.paramCount_ !== null && value.length !== this.paramCount_) {
      return {success: false};
    }

    return {result: value.toString(), success: true};
  }
}

export function anyParamsFunctionConverter(): FunctionConverter<
  (...args: any[]) => any
> {
  return new FunctionConverter(null);
}

export function noParamFunctionConverter(): FunctionConverter<() => any> {
  return new FunctionConverter(0);
}

export function oneParamFunctionConverter(): FunctionConverter<
  (arg: any) => any
> {
  return new FunctionConverter(1);
}

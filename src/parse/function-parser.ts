import { Parser } from '../interfaces/parser';

export class FunctionParser<F extends Function> implements Parser<F> {
  constructor(private readonly paramCount_: number | null) { }

  parse(input: string | null): F | null {
    if (input === null) {
      return null;
    }

    const expr = `(${input})`;
    /* tslint:disable:no-eval */
    const fn = eval(expr);
    /* tslint:enable:no-eval */

    if (!(fn instanceof Function)) {
      return null;
    }

    if (this.paramCount_ !== null && fn.length !== this.paramCount_) {
      return null;
    }
    return fn;
  }

  stringify(value: F | null): string {
    if (value === null) {
      return '';
    }

    if (this.paramCount_ !== null && value.length !== this.paramCount_) {
      return '';
    }

    return value.toString();
  }

  static anyParams(): FunctionParser<(...args: any[]) => any> {
    return new FunctionParser(null);
  }

  static noParam(): FunctionParser<() => any> {
    return new FunctionParser(0);
  }

  static oneParam(): FunctionParser<(arg: any) => any> {
    return new FunctionParser(1);
  }
}

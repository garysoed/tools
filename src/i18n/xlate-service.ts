import {I18n} from './i18n';
import {XtractService, argName, keyName} from './xtract-service';

export class XlateService implements I18n {
  private readonly xtract = new XtractService();

  constructor(private readonly data: ReadonlyMap<string, string>) {}

  simple(...argNames: readonly string[]):
      (strings: TemplateStringsArray, ...args: readonly unknown[]) => string {
    return (strings: TemplateStringsArray, ...args: readonly unknown[]) => {
      const key = keyName(strings, argNames, args.length);
      let output = this.data.get(key) ?? key;

      for (let i = 0; i < args.length; i++) {
        output = output.replace(argName(argNames, i), `${args[i]}`);
      }

      return output;
    };
  }
}
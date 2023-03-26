import {I18n} from './i18n';

export class XtractService implements I18n {
  private readonly keysInternal = new Set<string>();

  get keys(): ReadonlySet<string> {
    return this.keysInternal;
  }

  simple(...argNames: readonly string[]):
      (strings: TemplateStringsArray, ...args: readonly unknown[]) => string {
    return (strings: TemplateStringsArray, ...args: readonly unknown[]) => {
      const key = keyName(strings, argNames, args.length);
      this.keysInternal.add(key);

      const output = [];
      let i = 0;
      for (; i < args.length; i++) {
        output.push(strings[i]);
        output.push(`${args[i]}`);
      }

      output.push(strings[i]);
      return output.join('');
    };
  }
}

export function keyName(
    strings: TemplateStringsArray,
    argNames: readonly string[],
    argCount: number,
): string {
  const output = [];
  let i = 0;
  for (; i < argCount; i++) {
    output.push(strings[i]);
    output.push(argName(argNames, i));
  }

  output.push(strings[i]);
  return output.join('');
}

export function argName(argNames: readonly string[], index: number): string {
  return `$\{${argNames[index] ?? index}}`;
}
export interface I18n {
  simple(...argNames: readonly string[]):
      (strings: TemplateStringsArray, ...args: readonly unknown[]) => string;
}
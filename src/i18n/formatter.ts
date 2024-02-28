export type PluralFormatter<F> = ((count: number) => F) & {
  readonly key: string;
};
export type SimpleFormatter = ((inputs?: Record<string, string>) => string) & {
  readonly key: string;
};

export type Formatter = PluralFormatter<unknown> | SimpleFormatter;

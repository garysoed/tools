export interface Registration {
  readonly plain: string;
  readonly description?: string;
  readonly keyOverride?: string;
}

export interface I18n {
  simple(registration: Registration): (inputs?: Record<string, string>) => string;
}
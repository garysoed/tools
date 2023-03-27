export interface SimpleRegistration {
  readonly plain: string;
  readonly description?: string;
  readonly keyOverride?: string;
}

export interface PluralRegistration<T> {
  readonly zero?: T;
  readonly one?: T;
  readonly two?: T;
  readonly few?: T;
  readonly many?: T;
  readonly other: T;
  readonly description?: string;
  readonly keyOverride?: string;
}

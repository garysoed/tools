export interface PluralExtraction {
  readonly type: 'plural';
  readonly key: ExtractionKey;
  readonly zero: ExtractionKey;
  readonly one: ExtractionKey;
  readonly two: ExtractionKey;
  readonly few: ExtractionKey;
  readonly many: ExtractionKey;
  readonly other: ExtractionKey;
}

export interface SimpleExtraction {
  readonly type: 'simple';
  readonly key: ExtractionKey;
  readonly translation: string;
}

export type ExtractionKey = string & {readonly subtype: unique symbol};
export function asExtractionKey(innerKey: string): ExtractionKey {
  return innerKey as unknown as ExtractionKey;
}

export type Extraction = PluralExtraction | SimpleExtraction;

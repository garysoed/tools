export interface PluralExtraction {
  readonly few: ExtractionKey;
  readonly key: ExtractionKey;
  readonly many: ExtractionKey;
  readonly one: ExtractionKey;
  readonly other: ExtractionKey;
  readonly two: ExtractionKey;
  readonly type: 'plural';
  readonly zero: ExtractionKey;
}

export interface SimpleExtraction {
  readonly key: ExtractionKey;
  readonly translation: string;
  readonly type: 'simple';
}

export type ExtractionKey = string & {readonly subtype: unique symbol};
export function asExtractionKey(innerKey: string): ExtractionKey {
  return innerKey as unknown as ExtractionKey;
}

export type Extraction = PluralExtraction | SimpleExtraction;

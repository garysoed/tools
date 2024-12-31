import {ExtractionKey, asExtractionKey} from './extraction';
import {Formatter} from './formatter';

export interface PluralRegistration<F extends Formatter> {
  readonly description?: string;
  readonly few?: F;
  readonly keyOverride?: string;
  readonly many?: F;
  readonly one?: F;
  readonly other: F;
  readonly two?: F;
  readonly zero?: F;
}

export function getPluralKey(
  registration: PluralRegistration<Formatter>,
): ExtractionKey {
  return asExtractionKey(
    registration.keyOverride ?? `[PLURAL] ${registration.other.key}`,
  );
}

export interface SimpleRegistration {
  readonly description?: string;
  readonly keyOverride?: string;
  readonly plain: string;
}

export function getSimpleKey(registration: SimpleRegistration): ExtractionKey {
  return asExtractionKey(registration.keyOverride ?? registration.plain);
}

export type Registration = PluralRegistration<Formatter> | SimpleRegistration;

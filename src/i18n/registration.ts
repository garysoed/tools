import {ExtractionKey, asExtractionKey} from './extraction';
import {Formatter} from './formatter';

export interface PluralRegistration<F extends Formatter> {
  readonly zero?: F;
  readonly one?: F;
  readonly two?: F;
  readonly few?: F;
  readonly many?: F;
  readonly other: F;
  readonly description?: string;
  readonly keyOverride?: string;
}

export function getPluralKey(registration: PluralRegistration<Formatter>): ExtractionKey {
  return asExtractionKey(registration.keyOverride ?? `[PLURAL] ${registration.other.key}`);
}

export interface SimpleRegistration {
  readonly plain: string;
  readonly description?: string;
  readonly keyOverride?: string;
}

export function getSimpleKey(registration: SimpleRegistration): ExtractionKey {
  return asExtractionKey(registration.keyOverride ?? registration.plain);
}

export type Registration = PluralRegistration<Formatter>|SimpleRegistration;
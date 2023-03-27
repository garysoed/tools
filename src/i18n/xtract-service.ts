import {ExtractionKey} from './extraction';
import {Formatter, PluralFormatter, SimpleFormatter} from './formatter';
import {I18n} from './i18n';
import {PluralRegistration, Registration, SimpleRegistration, getPluralKey, getSimpleKey} from './registration';

export class XtractService implements I18n {
  private readonly registrationsInternal = new Map<ExtractionKey, Registration>();

  get registrations(): ReadonlyMap<ExtractionKey, Registration> {
    return this.registrationsInternal;
  }

  plurals<F extends Formatter>(registration: PluralRegistration<F>): PluralFormatter<F> {
    const key = getPluralKey(registration);
    this.register(key, registration);
    return Object.assign((): F => registration.other, {key});
  }

  simple(registration: SimpleRegistration): SimpleFormatter {
    const key = getSimpleKey(registration);
    this.register(key, registration);
    return Object.assign((): string => {
      return `[RAW] ${registration.plain}`;
    }, {key});
  }

  private register(key: ExtractionKey, registration: Registration): void {
    if (this.registrationsInternal.has(key)) {
      throw new Error(`Registration key ${key} already exists`);
    }

    this.registrationsInternal.set(key, registration);
  }
}

import {SimpleFormatter} from './formatter';
import {I18n} from './i18n';
import {SimpleRegistration} from './registration';

export class XtractService implements I18n {
  private readonly registrationsInternal = new Map<string, SimpleRegistration>();

  get registrations(): ReadonlyMap<string, SimpleRegistration> {
    return this.registrationsInternal;
  }

  simple(registration: SimpleRegistration): SimpleFormatter {
    this.register(registration);
    return (): string => {
      return `[RAW] ${registration.plain}`;
    };
  }

  private register(registration: SimpleRegistration): void {
    const key = registration.keyOverride ?? registration.plain;
    if (this.registrationsInternal.has(key)) {
      throw new Error(`Registration key ${key} already exists`);
    }

    this.registrationsInternal.set(key, registration);
  }
}

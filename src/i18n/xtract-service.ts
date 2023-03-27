import {SimpleFormatter} from './formatter';
import {I18n, Registration} from './i18n';

export class XtractService implements I18n {
  private readonly registrationsInternal = new Map<string, Registration>();

  get registrations(): ReadonlyMap<string, Registration> {
    return this.registrationsInternal;
  }

  simple(registration: Registration): SimpleFormatter {
    this.register(registration);
    return (): string => {
      return `[RAW] ${registration.plain}`;
    };
  }

  private register(registration: Registration): void {
    const key = registration.keyOverride ?? registration.plain;
    if (this.registrationsInternal.has(key)) {
      throw new Error(`Registration key ${key} already exists`);
    }

    this.registrationsInternal.set(key, registration);
  }
}

import {mapFrom} from '../collect/structures/map-from';

import {I18n, Registration} from './i18n';

export class XlateService implements I18n {
  constructor(private readonly data: ReadonlyMap<string, string>) {}

  simple(registration: Registration): (inputs?: Record<string, string>) => string {
    const key = registration.keyOverride ?? registration.plain;
    const template = this.data.get(key) ?? registration.plain;
    return (inputs: Record<string, string> = {}): string => {
      let output = template;

      for (const [key, value] of mapFrom(inputs)) {
        output = output.replace(`{{${key}}}`, value);
      }

      return output;
    };
  }
}
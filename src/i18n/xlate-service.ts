import {mapFrom} from '../collect/structures/map-from';
import {cache} from '../data/cache';

import {SimpleExtraction} from './extraction';
import {SimpleFormatter} from './formatter';
import {I18n} from './i18n';
import {SimpleRegistration} from './registration';

interface Args {
  readonly data: readonly SimpleExtraction[];
}

export class XlateService implements I18n {
  constructor(private readonly args: Args) {}

  @cache()
  private get extractions(): ReadonlyMap<string, SimpleExtraction> {
    const map = new Map<string, SimpleExtraction>();
    for (const extraction of this.args.data) {
      map.set(extraction.key, extraction);
    }

    return map;
  }

  simple(registration: SimpleRegistration): SimpleFormatter {
    const key = registration.keyOverride ?? registration.plain;
    const template = this.extractions.get(key)?.translation ?? registration.plain;
    return (inputs: Record<string, string> = {}): string => {
      let output = template;

      for (const [key, value] of mapFrom(inputs)) {
        output = output.replace(`{{${key}}}`, value);
      }

      return output;
    };
  }
}
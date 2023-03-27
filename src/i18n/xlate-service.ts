import {mapFrom} from '../collect/structures/map-from';
import {cache} from '../data/cache';

import {Extraction, ExtractionKey, PluralExtraction, SimpleExtraction} from './extraction';
import {Formatter, PluralFormatter, SimpleFormatter} from './formatter';
import {I18n} from './i18n';
import {PluralRegistration, SimpleRegistration, getPluralKey, getSimpleKey} from './registration';

interface Args {
  readonly data: readonly Extraction[];
  readonly locale: string;
}

export class XlateService implements I18n {
  private readonly plural = new Intl.PluralRules(this.args.locale);
  constructor(private readonly args: Args) {}

  plurals<F extends Formatter>(registration: PluralRegistration<F>): PluralFormatter<F> {
    const key = getPluralKey(registration);
    const extraction = this.assertExtraction(key);
    if (extraction.type !== 'plural') {
      return Object.assign((): F => registration.other, {key});
    }

    return this.resolveExtraction<F>(extraction);
  }

  simple(registration: SimpleRegistration): SimpleFormatter {
    const key = getSimpleKey(registration);
    const extraction = this.assertExtraction(key);
    if (extraction.type !== 'simple') {
      return this.resolveExtraction({type: 'simple', key, translation: registration.plain});
    }
    return this.resolveExtraction(extraction);
  }

  private assertExtraction(key: ExtractionKey): Extraction {
    const extraction = this.extractions.get(key);
    if (!extraction) {
      throw new Error(`No extraction for ${key} found`);
    }

    return extraction;
  }

  @cache()
  private get extractions(): ReadonlyMap<ExtractionKey, Extraction> {
    const map = new Map<ExtractionKey, Extraction>();
    for (const extraction of this.args.data) {
      map.set(extraction.key, extraction);
    }

    return map;
  }

  private resolveExtraction<T>(extraction: PluralExtraction): PluralFormatter<T>;
  private resolveExtraction(extraction: SimpleExtraction): SimpleFormatter;
  private resolveExtraction(extraction: Extraction): Formatter;
  private resolveExtraction(extraction: Extraction): Formatter {
    switch (extraction.type) {
      case 'plural': {
        const fn = (count: number): Formatter => {
          const rule = this.plural.select(count);
          const subKey = extraction[rule];
          return this.resolveExtraction(this.assertExtraction(subKey));
        };
        return Object.assign(fn, {key: extraction.key});
      }
      case 'simple': {
        const fn = (inputs: Record<string, string> = {}): string => {
          const template = extraction.translation;
          let output = template;

          for (const [key, value] of mapFrom(inputs)) {
            output = output.replace(`{{${key}}}`, value);
          }

          return output;
        };
        return Object.assign(fn, {key: extraction.key});
      }
    }
  }
}
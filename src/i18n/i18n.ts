import {Formatter, PluralFormatter, SimpleFormatter} from './formatter';
import {PluralRegistration, SimpleRegistration} from './registration';

export interface I18n {
  plural<F extends Formatter>(args: PluralRegistration<F>): PluralFormatter<F>;

  simple(registration: SimpleRegistration): SimpleFormatter;
}

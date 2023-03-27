import {SimpleFormatter} from './formatter';
import {SimpleRegistration} from './registration';

export interface I18n {
  simple(registration: SimpleRegistration): SimpleFormatter;
}
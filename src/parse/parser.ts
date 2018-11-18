import { Converter } from '../converter/converter';

export interface Parser<T> extends Converter<T, string> { }

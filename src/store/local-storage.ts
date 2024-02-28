import {Converter} from 'nabu';

import {WebStorage} from './web-storage';

export class LocalStorage<T, S> extends WebStorage<T, S> {
  constructor(
    window: Window,
    prefix: string,
    converter: Converter<T, S>,
    grammar: Converter<S, string>,
  ) {
    super(window.localStorage, prefix, converter, grammar);
  }
}

import { Converter, Serializable } from 'nabu';

import { WebStorage } from './web-storage';

export class LocalStorage<T> extends WebStorage<T> {
  constructor(
      window: Window,
      prefix: string,
      converter: Converter<T, Serializable>,
      grammar: Converter<Serializable, string>,
  ) {
    super(window.localStorage, prefix, converter, grammar);
  }
}

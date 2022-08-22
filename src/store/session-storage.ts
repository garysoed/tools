import {Converter} from 'nabu';

import {WebStorage} from '../store/web-storage';

export class SessionStorage<T, S> extends WebStorage<T, S> {
  constructor(
      window: Window,
      prefix: string,
      converter: Converter<T, S>,
      grammar: Converter<S, string>,
  ) {
    super(window.sessionStorage, prefix, converter, grammar);
  }
}

import { Converter, Serializable } from 'nabu/export/main';
import { WebStorage } from '../store/web-storage';

export class SessionStorage<T> extends WebStorage<T> {
  constructor(
      window: Window,
      prefix: string,
      converter: Converter<T, Serializable>,
  ) {
    super(window.sessionStorage, prefix, converter);
  }

  static of<T>(
      window: Window,
      prefix: string,
      converter: Converter<T, Serializable>,
  ): SessionStorage<T> {
    return new SessionStorage(window, prefix, converter);
  }
}

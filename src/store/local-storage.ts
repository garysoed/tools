import { Converter, Serializable } from '@nabu/main';
import { WebStorage } from './web-storage';

export class LocalStorage<T> extends WebStorage<T> {
  constructor(
      window: Window,
      prefix: string,
      converter: Converter<T, Serializable>,
  ) {
    super(window.localStorage, prefix, converter);
  }

  static of<T>(
      window: Window,
      prefix: string,
      converter: Converter<T, Serializable>,
  ): LocalStorage<T> {
    return new LocalStorage(window, prefix, converter);
  }
}

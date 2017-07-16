import { Parser } from '../interfaces/parser';
import { WebStorage } from './web-storage';


export class LocalStorage<T> extends WebStorage<T> {
  constructor(window: Window, prefix: string, parser: Parser<T>) {
    super(window.localStorage, prefix, parser);
  }

  static of<T>(window: Window, prefix: string, parser: Parser<T>): LocalStorage<T> {
    return new LocalStorage(window, prefix, parser);
  }
}

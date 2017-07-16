import { Parser } from '../interfaces/parser';
import { WebStorage } from '../store/web-storage';


export class SessionStorage<T> extends WebStorage<T> {
  constructor(window: Window, prefix: string, parser: Parser<T>) {
    super(window.sessionStorage, prefix, parser);
  }
}

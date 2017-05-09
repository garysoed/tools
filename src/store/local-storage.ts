import { WebStorage } from './web-storage';


export class LocalStorage<T> extends WebStorage<T> {
  constructor(window: Window, prefix: string) {
    super(window.localStorage, prefix);
  }

  static of<T>(window: Window, prefix: string): LocalStorage<T> {
    return new LocalStorage(window, prefix);
  }
}
// TODO: Mutable

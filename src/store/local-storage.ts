import {WebStorage} from './web-storage';


export class LocalStorage<T> extends WebStorage<T> {
  constructor(window: Window, prefix: string) {
    super(window.localStorage, prefix);
  }
}

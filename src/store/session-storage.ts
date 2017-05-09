import { WebStorage } from './web-storage';


export class SessionStorage<T> extends WebStorage<T> {
  constructor(window: Window, prefix: string) {
    super(window.sessionStorage, prefix);
  }
}
// TODO: Mutable

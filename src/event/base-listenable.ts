import BaseDisposable from '../dispose/base-disposable';
import DisposableFunction from '../dispose/disposable-function';


export default class BaseListenable<T> extends BaseDisposable {
  protected callbacksMap_: Map<T, ((data: any) => void)[]>;

  constructor() {
    super();
    this.callbacksMap_ = new Map();
  }

  /**
   * @override
   */
  disposeInternal(): void {
    this.callbacksMap_.clear();
  }

  dispatch(eventType: T, payload: any = null): void {
    let callbacks = this.callbacksMap_.get(eventType);
    if (!!callbacks) {
      callbacks.forEach((callback: (data: any) => void) => {
        window.setTimeout(() => {
          callback(payload);
        }, 0);
      });
    }
  }

  on(eventType: T, callback: (data: any) => void): DisposableFunction {
    if (!this.callbacksMap_.has(eventType)) {
      this.callbacksMap_.set(eventType, []);
    }
    let callbacks = this.callbacksMap_.get(eventType);
    let index = callbacks.length;
    callbacks.push(callback);
    return new DisposableFunction(() => {
      callbacks.splice(index, 1);
    });
  }
}

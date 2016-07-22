import BaseDisposable from '../dispose/base-disposable';
import DisposableFunction from '../dispose/disposable-function';


/**
 * Base class for classes that can dispatch events.
 *
 * To use this, you need two parts:
 *
 * 1.  Class that dispatches the event.
 * 1.  Enum of event types dispatched by that class.
 *
 * @param <T> Type of event that this class dispatches.
 */
export class BaseListenable<T> extends BaseDisposable {
  private callbacksMap_: Map<T, ((data: any) => void)[]>;

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

  /**
   * @param eventType Type of event to dispatch.
   * @param payload Any payloads that are associated with the event, if any.
   */
  dispatch(eventType: T, payload: any = null): void {
    let callbacks = this.callbacksMap_.get(eventType);
    if (!!callbacks) {
      callbacks.forEach((callback: (data: any) => void) => {
        callback(payload);
      });
    }
  }

  /**
   * Listens to an event dispatched by this object.
   *
   * @param eventType Type of event to listen to.
   * @param callback The callback to be called when the specified event is dispatched.
   * @return [[DisposableFunction]] that should be disposed to stop listening to the event.
   */
  on(eventType: T, callback: (payload: any) => void): DisposableFunction {
    if (!this.callbacksMap_.has(eventType)) {
      this.callbacksMap_.set(eventType, []);
    }
    const callbacks = this.callbacksMap_.get(eventType);
    let index = callbacks!.length;
    callbacks!.push(callback);
    return new DisposableFunction(() => {
      callbacks!.splice(index, 1);
    });
  }
}

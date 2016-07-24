import {BaseDisposable} from '../dispose/base-disposable';
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
  private bubbleCallbacksMap_: Map<T, ((data: any) => void)[]> = new Map();
  private captureCallbacksMap_: Map<T, ((data: any) => void)[]> = new Map();

  constructor() {
    super();
  }

  /**
   * @override
   */
  disposeInternal(): void {
    this.bubbleCallbacksMap_.clear();
    this.captureCallbacksMap_.clear();
  }

  /**
   * Dispatches the event.
   *
   * This function takes in a callback function. The event will be dispatched twice - once before
   * the callback is called, and once after the callback is called. The event occuring before the
   * callback is a `capture` event, while the one after the callback is a `bubble` event.
   *
   * @param eventType Type of event to dispatch.
   * @param payload Any payloads that are associated with the event, if any.
   * @param callback The function to be called during the duration of the event.
   */
  dispatch(eventType: T, callback: () => void, payload: any = null): void {
    if (this.captureCallbacksMap_.has(eventType)) {
      this.captureCallbacksMap_.get(eventType)!.forEach((handler: (data: any) => void) => {
        handler(payload);
      });
    }

    callback();

    if (this.bubbleCallbacksMap_.has(eventType)) {
      this.bubbleCallbacksMap_.get(eventType)!.forEach((handler: (data: any) => void) => {
        handler(payload);
      });
    }
  }

  /**
   * Listens to an event dispatched by this object.
   *
   * @param eventType Type of event to listen to.
   * @param callback The callback to be called when the specified event is dispatched.
   * @param useCapture True iff the capture phase should be used. Defaults to false.
   * @return [[DisposableFunction]] that should be disposed to stop listening to the event.
   */
  on(
      eventType: T,
      callback: (payload: any) => void,
      useCapture: boolean = false): DisposableFunction {
    let map = useCapture ? this.captureCallbacksMap_ : this.bubbleCallbacksMap_;
    if (!map.has(eventType)) {
      map.set(eventType, []);
    }
    const callbacks = map.get(eventType);
    callbacks!.push(callback);
    return new DisposableFunction(() => {
      let index = callbacks!.indexOf(callback);
      if (index >= 0) {
        callbacks!.splice(index, 1);
      }
    });
  }

  /**
   * Listens to an event dispatched by this object once.
   *
   * @param eventType Type of event to listen to.
   * @param callback The callback to be called when the specified event is dispatched.
   * @param useCapture True iff the capture phase should be used. Defaults to false.
   * @return [[DisposableFunction]] that should be disposed to stop listening to the event.
   */
  once(
      eventType: T,
      callback: (payload: any) => void,
      useCapture: boolean = false): DisposableFunction {
    let disposableFunction = this.on(
        eventType,
        (payload: any) => {
          callback(payload);
          disposableFunction.dispose();
        },
        useCapture);
    return disposableFunction;
  }
}

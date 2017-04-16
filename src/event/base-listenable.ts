import { BaseDisposable } from '../dispose/base-disposable';
import { DisposableFunction } from '../dispose/disposable-function';
import { Listenable } from '../interfaces/listenable';


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
export class BaseListenable<T> extends BaseDisposable implements Listenable<T> {
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
   * @param callback The function to be called during the duration of the event.
   * @param payload Any payloads that are associated with the event, if any.
   */
  dispatch(eventType: T, callback: () => void = () => undefined, payload: any = null): void {
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

  async dispatchAsync(
      eventType: T,
      callback: () => Promise<void> = () => Promise.resolve(),
      payload: any = null): Promise<void> {
    if (this.captureCallbacksMap_.has(eventType)) {
      this.captureCallbacksMap_.get(eventType)!.forEach((handler: (data: any) => void) => {
        handler(payload);
      });
    }

    await callback();

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
   * @param context The context to call the callback in.
   * @param useCapture True iff the capture phase should be used. Defaults to false.
   * @return [[DisposableFunction]] that should be disposed to stop listening to the event.
   */
  on(
      eventType: T,
      callback: (payload?: any) => void,
      context: Object,
      useCapture: boolean = false): DisposableFunction {
    let map = useCapture ? this.captureCallbacksMap_ : this.bubbleCallbacksMap_;
    if (!map.has(eventType)) {
      map.set(eventType, []);
    }
    const callbacks = map.get(eventType);
    const boundCallback = callback.bind(context);
    callbacks!.push(boundCallback);
    return new DisposableFunction(() => {
      let index = callbacks!.indexOf(boundCallback);
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
   * @param context The context to call the callback in.
   * @param useCapture True iff the capture phase should be used. Defaults to false.
   * @return [[DisposableFunction]] that should be disposed to stop listening to the event.
   */
  once(
      eventType: T,
      callback: (payload?: any) => void,
      context: Object,
      useCapture: boolean = false): DisposableFunction {
    let disposableFunction = this.on(
        eventType,
        (payload: any) => {
          callback.call(context, payload);
          disposableFunction.dispose();
        },
        this,
        useCapture);
    return disposableFunction;
  }
}

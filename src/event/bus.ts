import { BaseDisposable } from '../dispose/base-disposable';
import { DisposableFunction as DisposableFunctionImpl } from '../dispose/disposable-function';
import { DisposableFunction } from '../interfaces/disposable-function';
import { Event } from '../interfaces/event';
import { Log } from '../util/log';

type Callback<T, E extends Event<T>> = (event: E) => void;

/**
 * Represents an evvent bus.
 */
export class Bus<T, E extends Event<T>> extends BaseDisposable {
  private readonly bubbleCallbacksMap_: Map<T, Callback<T, E>[]> = new Map();
  private readonly captureCallbacksMap_: Map<T, Callback<T, E>[]> = new Map();

  constructor(private readonly log_: Log) {
    super();
  }

  dispatch(event: E): undefined;
  dispatch<R>(event: E, callback: () => R): R;
  dispatch(event: E, callback: () => any = () => undefined): any {
    Log.debug(this.log_, `[${this}] dispatching: `, event);
    const bubbleCallbacks = this.bubbleCallbacksMap_.get(event.type);
    const captureCallbacks = this.captureCallbacksMap_.get(event.type);
    if (captureCallbacks !== undefined) {
      captureCallbacks.forEach((handler: Callback<T, E>) => {
        try {
          handler(event);
        } catch (e) {
          Log.error(this.log_, e.message);
        }
      });
    }

    const result = callback();

    if (bubbleCallbacks !== undefined) {
      bubbleCallbacks.forEach((handler: Callback<T, E>) => {
        try {
          handler(event);
        } catch (e) {
          Log.error(this.log_, e.message);
        }
      });
    }

    return result;
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
    Log.debug(this.log_, `[${context}] listening to [${this}]:`, eventType);
    const map = useCapture ? this.captureCallbacksMap_ : this.bubbleCallbacksMap_;
    const callbacks = map.get(eventType);
    const boundCallback = callback.bind(context);
    if (callbacks === undefined) {
      map.set(eventType, [boundCallback]);
    } else {
      callbacks.push(boundCallback);
    }
    return new DisposableFunctionImpl(() => {
      const callbacks = map.get(eventType);
      if (callbacks === undefined) {
        return;
      }

      const index = callbacks.indexOf(boundCallback);
      if (index >= 0) {
        callbacks.splice(index, 1);
      }
    });
  }
}

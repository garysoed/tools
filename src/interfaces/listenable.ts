import { DisposableFunction } from '../interfaces/disposable-function';

export interface Listenable<T> {
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
  dispatch(eventType: T, callback: () => void, payload: any): void;

  dispatchAsync(eventType: T, callback: () => Promise<void>, payload: any): Promise<void>;

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
      useCapture: boolean): DisposableFunction;

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
      useCapture: boolean): DisposableFunction;
}
// TODO: Mutable

import { DisposableFunction } from '../dispose/disposable-function';

import { BaseListenable } from './base-listenable';


/**
 * Wraps an EventTarget to make it extends [[BaseListenable]].
 *
 * @param <T> Type of the wrapped element.
 */
export class ListenableDom<T extends EventTarget> extends BaseListenable<string> {
  /**
   * @param element The EventTarget to wrap.
   */
  constructor(private readonly eventTarget_: T) {
    super();
  }

  dispatch(
      eventType: string,
      callback: () => void = () => undefined,
      payload: any = null): void {
    callback();

    const bubbleEvent = new Event(eventType, {bubbles: true});
    bubbleEvent['payload'] = payload;
    this.eventTarget_.dispatchEvent(bubbleEvent);
  }

  async dispatchAsync(
      eventType: string,
      callback: () => Promise<void> = async () => Promise.resolve(),
      payload: any = null): Promise<void> {
    await callback();

    const bubbleEvent = new Event(eventType, {bubbles: true});
    bubbleEvent['payload'] = payload;
    this.eventTarget_.dispatchEvent(bubbleEvent);
  }

  /**
   * The wrapped EventTarget
   */
  getEventTarget(): T {
    return this.eventTarget_;
  }

  on(
      eventType: string,
      handler: (event: Event) => void,
      context: Object,
      useCapture: boolean = false): DisposableFunction {
    const boundHandler = handler.bind(context);
    this.eventTarget_.addEventListener(eventType, boundHandler, useCapture);

    return new DisposableFunction(() => {
      this.eventTarget_.removeEventListener(eventType, boundHandler, useCapture);
    });
  }

  /**
   * Creates an instance of [[ListenableElement]].
   *
   * @param <T> Type of the wrapped element.
   * @param element The EventTarget to wrap.
   */
  static of<T extends EventTarget>(element: T): ListenableDom<T> {
    return new ListenableDom<T>(element);
  }
}

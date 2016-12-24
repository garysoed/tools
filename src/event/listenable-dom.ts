import {DisposableFunction} from 'src/dispose/disposable-function';

import {BaseListenable} from './base-listenable';


/**
 * Wraps an EventTarget to make it extends [[BaseListenable]].
 *
 * @param <T> Type of the wrapped element.
 */
export class ListenableDom<T extends EventTarget> extends BaseListenable<string> {
  /**
   * @param element The EventTarget to wrap.
   */
  constructor(private eventTarget_: T) {
    super();
  }

  /**
   * @override
   */
  dispatch(
      eventType: string,
      callback: () => void = () => undefined,
      payload: any = null): void {
    callback();

    let bubbleEvent = new Event(eventType, {bubbles: true});
    bubbleEvent['payload'] = payload;
    this.eventTarget_.dispatchEvent(bubbleEvent);
  }

  /**
   * The wrapped EventTarget
   */
  getEventTarget(): T {
    return this.eventTarget_;
  }

  /**
   * @override BaseListenable
   */
  on(
      eventType: string,
      handler: (event: Event) => void,
      context: Object,
      useCapture: boolean = false): DisposableFunction {
    let boundHandler = handler.bind(context);
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

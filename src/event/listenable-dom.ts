import {BaseListenable} from './base-listenable';
import {DisposableFunction} from '../dispose/disposable-function';


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
      useCapture: boolean = false): DisposableFunction {
    this.eventTarget_.addEventListener(eventType, handler, useCapture);
    return new DisposableFunction(() => {
      this.eventTarget_.removeEventListener(eventType, handler, useCapture);
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

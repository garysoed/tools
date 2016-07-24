import {BaseListenable} from './base-listenable';
import DisposableFunction from '../dispose/disposable-function';


/**
 * Wraps an EventTarget to make it extends [[BaseListenable]].
 *
 * @param <T> Type of the wrapped element.
 */
export class ListenableDom<T extends EventTarget> extends BaseListenable<string> {
  private static __EVENT_CAPTURE: symbol = Symbol('capture');

  /**
   * @param element The EventTarget to wrap.
   */
  constructor(private eventTarget_: T) {
    super();
  }

  private onEventTriggered_(
      handler: (event: Event) => void,
      useCapture: boolean,
      event: Event): void {
    if (event[ListenableDom.__EVENT_CAPTURE] === undefined ||
        useCapture === event[ListenableDom.__EVENT_CAPTURE]) {
      handler(event);
    }
  }

  /**
   * @override
   */
  dispatch(eventType: string, callback: () => void, payload: any = null): void {
    let captureEvent = new Event(eventType, {'bubbles': false});
    captureEvent['payload'] = payload;
    captureEvent[ListenableDom.__EVENT_CAPTURE] = true;
    this.eventTarget_.dispatchEvent(captureEvent);

    callback();

    let bubbleEvent = new Event(eventType);
    bubbleEvent['payload'] = payload;
    bubbleEvent[ListenableDom.__EVENT_CAPTURE] = false;
    this.eventTarget_.dispatchEvent(bubbleEvent);
  }

  /**
   * The wrapped EventTarget
   */
  get eventTarget(): T {
    return this.eventTarget_;
  }

  /**
   * @override BaseListenable
   */
  on(
      eventType: string,
      handler: (event: Event) => void,
      useCapture: boolean = false): DisposableFunction {
    let boundHandler = this.onEventTriggered_.bind(this, handler, useCapture);
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

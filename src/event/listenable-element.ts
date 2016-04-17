import BaseListenable from './base-listenable';
import DisposableFunction from '../dispose/disposable-function';
import Enums from '../typescript/enums';


/**
 * Corresponds to DOM events. This must be the upper case version of the corresponding DOM events.
 */
export enum EventType {
  /**
   * The `beforeunload` DOM event.
   */
  BEFOREUNLOAD,

  BLUR,

  /**
   * The `click` DOM event.
   */
  CLICK,

  FOCUS,

  /**
   * The `load` DOM event.
   */
  LOAD,

  /**
   * The `message` DOM event.
   */
  MESSAGE,

  /**
   * The `mouseenter` DOM event.
   */
  MOUSEENTER,

  /**
   * The `mouseleave` DOM event.
   */
  MOUSELEAVE,

  /**
   * The `scroll` DOM event.
   */
  SCROLL,
}

/**
 * Wraps an EventTarget to make it extends [[BaseListenable]].
 *
 * @param <T> Type of the wrapped element.
 */
class ListenableElement<T extends EventTarget> extends BaseListenable<EventType> {
  private element_: T;
  private forwardedEvents_: Set<EventType>;
  private listener_: EventListener;

  /**
   * @param element The EventTarget to wrap.
   */
  constructor(element: T) {
    super();
    this.element_ = element;
    this.forwardedEvents_ = new Set<EventType>();
    this.listener_ = this.onEvent_.bind(this);
  }

  private onEvent_(event: Event): void {
    let eventType = Enums.fromLowerCaseString<EventType>(event.type, EventType);
    this.dispatch(eventType, event);
  }

  /**
   * @override BaseDisposable
   */
  disposeInternal(): void {
    this.forwardedEvents_.forEach((eventType: EventType) => {
      this.element_
          .removeEventListener(Enums.toLowerCaseString(eventType, EventType), this.listener_);
    });
  }

  /**
   * The wrapped EventTarget
   */
  get element(): T {
    return this.element_;
  }

  /**
   * @override BaseListenable
   */
  on(eventType: EventType, callback: (data: any) => void): DisposableFunction {
    if (!this.forwardedEvents_.has(eventType)) {
      this.element_.addEventListener(Enums.toLowerCaseString(eventType, EventType), this.listener_);
      this.forwardedEvents_.add(eventType);
    }

    return super.on(eventType, callback);
  }

  /**
   * Creates an instance of [[ListenableElement]].
   *
   * @param <T> Type of the wrapped element.
   * @param element The EventTarget to wrap.
   */
  static of<T extends EventTarget>(element: T): ListenableElement<T> {
    return new ListenableElement<T>(element);
  }
}

export default ListenableElement;

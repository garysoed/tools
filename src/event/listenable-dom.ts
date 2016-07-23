import {BaseListenable} from './base-listenable';
import DisposableFunction from '../dispose/disposable-function';
import {DomEvent} from './dom-event';
import {Enums} from '../typescript/enums';


/**
 * Wraps an EventTarget to make it extends [[BaseListenable]].
 *
 * @param <T> Type of the wrapped element.
 */
export class ListenableDom<T extends EventTarget> extends BaseListenable<DomEvent> {
  private element_: T;
  private forwardedEvents_: Set<DomEvent>;
  private listener_: EventListener;

  /**
   * @param element The EventTarget to wrap.
   */
  constructor(element: T) {
    super();
    this.element_ = element;
    this.forwardedEvents_ = new Set<DomEvent>();
    this.listener_ = this.onEvent_.bind(this);
  }

  private onEvent_(event: Event): void {
    let eventType = Enums.fromLowerCaseString<DomEvent>(event.type, DomEvent);
    this.dispatch(eventType, event);
  }

  /**
   * @override BaseDisposable
   */
  disposeInternal(): void {
    this.forwardedEvents_.forEach((eventType: DomEvent) => {
      this.element_
          .removeEventListener(Enums.toLowerCaseString(eventType, DomEvent), this.listener_);
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
  on(eventType: DomEvent, callback: (data: any) => void): DisposableFunction {
    if (!this.forwardedEvents_.has(eventType)) {
      this.element_.addEventListener(Enums.toLowerCaseString(eventType, DomEvent), this.listener_);
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
  static of<T extends EventTarget>(element: T): ListenableDom<T> {
    return new ListenableDom<T>(element);
  }
}

import BaseListenable from './base-listenable';
import DisposableFunction from '../dispose/disposable-function';
import Enums from '../typescript/enums';


/**
 * Corresponds to DOM events. This must be the upper case version of the corresponding DOM events.
 */
export enum EventType {
  BEFOREUNLOAD,
  CLICK,
  LOAD,
  SCROLL,
}

export default class ListenableElement extends BaseListenable<EventType> {
  private element_: EventTarget;
  private forwardedEvents_: Set<EventType>;
  private listener_: EventListener;

  constructor(element: EventTarget) {
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

  get element(): EventTarget {
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
}

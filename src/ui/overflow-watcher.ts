import BaseListenable from '../event/base-listenable';
import Doms from './doms';
import ListenableElement, { EventType as DomEventType } from '../event/listenable-element';


export enum State {
  COVERED,
  PARTIAL,
  UNCOVERED,
}

export enum EventType {
  CHANGED
};

export default class OverflowWatcher extends BaseListenable<EventType> {
  private containerEl_: HTMLElement;
  private element_: HTMLElement;
  private state_: State;

  constructor(container: HTMLElement, element: HTMLElement) {
    super();
    this.containerEl_ = container;
    this.element_ = element;
    this.state_ = null;

    let listenableContainer = new ListenableElement(container);
    this.addDisposable(
        listenableContainer,
        listenableContainer.on(DomEventType.SCROLL, this.onScroll_.bind(this)));
  }

  // TODO(gs): Memoize this.
  private getState_(): State {
    // TODO(gs): Support bottom / left / right
    let scrollTop = this.containerEl_.scrollTop;
    let relativeOffsetTop = Doms.relativeOffsetTop(this.element_, this.containerEl_);

    if (scrollTop <= relativeOffsetTop) {
      return State.UNCOVERED;
    } else if (scrollTop < relativeOffsetTop + this.element_.clientHeight) {
      // Check if the bottom end is also offscreen.
      return State.PARTIAL;
    } else {
      return State.COVERED;
    }
  }

  private onScroll_(): void {
    let newState = this.getState_();
    let oldState = this.state_;
    if (newState !== oldState) {
      this.state_ = newState;
      this.dispatch(EventType.CHANGED, oldState);
    }
  }

  get state(): State {
    if (this.state_ === null) {
      this.state_ = this.getState_();
    }
    return this.state_;
  }
};

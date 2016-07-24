import {BaseListenable} from '../event/base-listenable';
import {Doms} from './doms';
import {DomEvent} from '../event/dom-event';
import {ListenableDom} from '../event/listenable-dom';

/**
 * State of the element being watched.
 */
export enum State {
  /**
   * The element is completely covered.
   */
  COVERED,

  /**
   * The element is partially covered.
   */
  PARTIAL,

  /**
   * The element is completely uncovered.
   */
  UNCOVERED,
}

/**
 * Events dispatched by the watcher.
 */
export enum EventType {
  /**
   * The state of the element has changed.
   */
  CHANGED,
};

/**
 * Watches an element in the given container to see if the element is scrolled off the container.
 *
 * To use this, give it the container element and the element to be watched. Listen to the
 * [[CHANGED]] event for when the element's state ([[COVERED]], [[PARTIAL]], [[UNCOVERED]]) has
 * changed.
 */
class OverflowWatcher extends BaseListenable<EventType> {
  private containerEl_: HTMLElement;
  private element_: HTMLElement;
  private state_: (State|null);

  /**
   * @param container The container element.
   * @param element The element to watch.
   */
  constructor(container: HTMLElement, element: HTMLElement) {
    super();
    this.containerEl_ = container;
    this.element_ = element;
    this.state_ = null;

    let listenableContainer = new ListenableDom(container);
    this.addDisposable(
        listenableContainer,
        listenableContainer.on(DomEvent.SCROLL, this.onScroll_.bind(this)));
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
      this.dispatch(
          EventType.CHANGED,
          () => {
            this.state_ = newState;
          },
          oldState);
    }
  }

  /**
   * [[State]] of the element being watched.
   */
  get state(): State {
    if (this.state_ === null) {
      this.state_ = this.getState_();
    }
    return this.state_;
  }
};

export default OverflowWatcher;

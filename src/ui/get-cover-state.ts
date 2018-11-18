import { Doms } from '../ui/doms';

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

// TODO: rxjs this
export function getCoverState(containerEl: HTMLElement, targetEl: HTMLElement): State {
  // TODO(gs): Support bottom / left / right
  const scrollTop = containerEl.scrollTop;
  const relativeOffsetTop = Doms.relativeOffsetTop(targetEl, containerEl);

  if (scrollTop <= relativeOffsetTop) {
    return State.UNCOVERED;
  } else if (scrollTop < relativeOffsetTop + targetEl.clientHeight) {
    // Check if the bottom end is also offscreen.
    return State.PARTIAL;
  } else {
    return State.COVERED;
  }
}

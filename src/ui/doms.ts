import {Iterables} from 'src/collection/iterables';

/**
 * Methods to manipulate DOM objects.
 */
export class Doms {
  /**
   * Returns an iterable that uses a seed value and continuously transforms it.
   *
   * @param start The seed value.
   * @param stepper Function to step to the next value. Return null to stop the iteration.
   * @return Iterable object that starts with the seed value and continuously steps through it.
   * @TODO Move to iterables.
   */
  static domIterable(start: HTMLElement, stepper: (fromEl: HTMLElement) => HTMLElement):
      Iterable<HTMLElement> {
    return {
      [Symbol.iterator](): Iterator<HTMLElement> {
        let currentEl = start;
        return {
          next(value?: any): IteratorResult<HTMLElement> {
            let done = currentEl === null;
            let nextValue = currentEl;

            if (currentEl !== null) {
              currentEl = stepper(currentEl);
            }

            return {
              done: done,
              value: nextValue,
            };
          },
        };
      },
    };
  }

  /**
   * Returns the shadow host of the current element.
   *
   * The element must be the root element in the shadow DOM.
   *
   * @param element The element to returns its shadow host of.
   * @return The shadow host, or null if not found, or if the element's parent node is not the
   *    shadow root.
   */
  static getShadowHost(element: HTMLElement): HTMLElement {
    let shadowRoot = element.parentNode;
    return shadowRoot.nodeType === 11 ? shadowRoot['host'] : null;
  }

  /**
   * Returns an iterable that navigates up the DOM hierarchy using the `offsetParent` property.
   *
   * @param start The DOM element to start with.
   * @return The iterable that navigates up the `offsetParent` chain.
   */
  static offsetParentIterable(start: HTMLElement): Iterable<HTMLElement> {
    return Doms.domIterable(start, (fromEl: HTMLElement) => {
      return <HTMLElement> fromEl.offsetParent;
    });
  }

  /**
   * Returns an iterable that navigates up the DOM hierarchy using the `parentElement` property.
   *
   * @param start The DOM element to start with.
   * @return The iterable that navigates up the parent chain.
   */
  static parentIterable(start: HTMLElement, bustShadow: boolean = false): Iterable<HTMLElement> {
    return Doms.domIterable(start, (fromEl: HTMLElement) => {
      let parent = fromEl.parentElement;
      return (parent === null && bustShadow) ? Doms.getShadowHost(fromEl) : parent;
    });
  }

  /**
   * Returns the relative offset top between the two given elements.
   *
   * @param fromEl The element to do measurements from.
   * @param toEl The element to do measurements to.
   * @return The relative offset top between the two given elements.
   */
  static relativeOffsetTop(fromEl: HTMLElement, toEl: HTMLElement): number {
    let distance = 0;
    let foundDestination = false;
    let currentEl;

    Iterables.of(Doms.offsetParentIterable(fromEl))
        .iterate((value: HTMLElement, breakFn: () => void) => {
          currentEl = value;
          if (value === toEl) {
            foundDestination = true;
            breakFn();
          } else {
            distance += currentEl.offsetTop;
          }
        });

    if (!foundDestination) {
      throw Error('Cannot find offset ancestor. Check if the toElement has non static position');
    }
    return distance;
  }
};

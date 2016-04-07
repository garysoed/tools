import Iterables from '../collection/iterables';

/**
 * Methods to manipulate DOM objects.
 */
class Doms {
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
  static parentIterable(start: HTMLElement): Iterable<HTMLElement> {
    return Doms.domIterable(start, (fromEl: HTMLElement) => {
      return fromEl.parentElement;
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
        .forOf((value: HTMLElement, breakFn: () => void) => {
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

export default Doms;

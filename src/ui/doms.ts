import Iterables from '../collection/iterables';

const Doms = {
  domIterable(start: HTMLElement, stepper: (fromEl: HTMLElement) => HTMLElement):
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
  },

  offsetParentIterable(start: HTMLElement): Iterable<HTMLElement> {
    return Doms.domIterable(start, (fromEl: HTMLElement) => {
      return <HTMLElement> fromEl.offsetParent;
    });
  },

  parentIterable(start: HTMLElement): Iterable<HTMLElement> {
    return Doms.domIterable(start, (fromEl: HTMLElement) => {
      return fromEl.parentElement;
    });
  },

  relativeOffsetTop(fromEl: HTMLElement, to: HTMLElement): number {
    let distance = 0;
    let foundDestination = false;
    let currentEl;

    Iterables.of(Doms.offsetParentIterable(fromEl))
        .forOf((value: HTMLElement, breakFn: () => void) => {
          currentEl = value;
          if (value === to) {
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
  },
};

export default Doms;

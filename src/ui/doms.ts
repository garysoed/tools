import Iterables from '../collection/iterables';

const Doms = {
  offsetParentIterable(start: HTMLElement): Iterable<HTMLElement> {
    return {
      [Symbol.iterator](): Iterator<HTMLElement> {
        let currentEl = start;
        return {
          next(value?: any): IteratorResult<HTMLElement> {
            let done = currentEl === null;
            let nextValue = currentEl;

            if (currentEl !== null) {
              currentEl = <HTMLElement> currentEl.offsetParent;
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

  relativeOffsetTop(from: HTMLElement, to: HTMLElement): number {
    let distance = 0;
    let foundDestination = false;
    let currentEl;

    Iterables.of(Doms.offsetParentIterable(from))
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

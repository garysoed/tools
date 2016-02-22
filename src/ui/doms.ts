export default {
  relativeOffsetTop(from: HTMLElement, to: HTMLElement): number {
    let distance = 0;
    let currentEl;
    for (currentEl = from;
        currentEl !== null && currentEl !== to;
        currentEl = <HTMLElement> currentEl.offsetParent) {
      distance += currentEl.offsetTop;
    }

    if (currentEl === null) {
      throw Error('Cannot find offset ancestor. Check if the toElement has non static position');
    }
    return distance;
  },
};

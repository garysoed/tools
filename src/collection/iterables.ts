import BaseFluent from './base-fluent';

export class FluentIterables<T> extends BaseFluent<Iterable<T>> {
  constructor(data: Iterable<T>) {
    super(data);
  }

  forOf(fn: (value: T, breakFn: () => void) => void): void {
    let iterator = this.data[Symbol.iterator]();
    let shouldBreak = false;
    for (let result = iterator.next(); !result.done && !shouldBreak; result = iterator.next()) {
      fn(result.value, () => {
        shouldBreak = true;
      });
    }
  }
}

export default {
  of<T>(data: Iterable<T>): FluentIterables<T> {
    return new FluentIterables<T>(data);
  },
}

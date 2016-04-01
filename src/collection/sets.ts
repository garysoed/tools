import BaseFluent from './base-fluent';

export class FluentSet<T> extends BaseFluent<Set<T>> {
  constructor(data: Set<T>) {
    super(data);
  }
};

const Sets = {
  fromArray<T>(array: T[]): FluentSet<T> {
    return Sets.of(new Set(array));
  },

  of<T>(set: Set<T>): FluentSet<T> {
    return new FluentSet(set);
  },
};

export default Sets;

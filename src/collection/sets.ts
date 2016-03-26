import BaseFluent from './base-fluent';

export class FluentSets<T> extends BaseFluent<Set<T>> {
  constructor(data: Set<T>) {
    super(data);
  }
};

const Sets = {
  fromArray<T>(array: T[]): FluentSets<T> {
    return Sets.of(new Set(array));
  },

  of<T>(set: Set<T>): FluentSets<T> {
    return new FluentSets(set);
  },
};

export default Sets;

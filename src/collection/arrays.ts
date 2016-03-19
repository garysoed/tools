import BaseFluent from './base-fluent';

export class FluentArrays<T> extends BaseFluent<T[]> {
  constructor(data: T[]) {
    super(data);
  }
}

export default {
  of<T>(data: T[]): FluentArrays<T> {
    return new FluentArrays<T>(data);
  },
};

import BaseFluent from './base-fluent';

export class FluentArrays<T> extends BaseFluent<T[]> {
  constructor(data: T[]) {
    super(data);
  }
}

const Arrays = {
  fromNumericalIndexed<T>(data: {[index: number]: T, length: number}): FluentArrays<T> {
    let array = [];
    for (let i = 0; i < data.length; i++) {
      array.push(data[i]);
    }
    return Arrays.of(array);
  },

  of<T>(data: T[]): FluentArrays<T> {
    return new FluentArrays<T>(data);
  },
};

export default Arrays;

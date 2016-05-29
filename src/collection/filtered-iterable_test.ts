import TestBase from '../test-base';
TestBase.setup();

import {ArrayIterable} from './array-iterable';
import {FilteredIterable} from './filtered-iterable';
import {Iterables} from './iterables';


describe('collection.FilteredIterable', () => {
  it('should return the correct iterable', () => {
    let filterFn = (value: number) => {
      return value % 2 === 0;
    };
    let iterable = FilteredIterable.newInstance(ArrayIterable.newInstance([1, 2, 3, 4]), filterFn);
    let result = [];
    Iterables.of(iterable).iterate((value: number) => {
      result.push(value);
    });
    expect(result).toEqual([2, 4]);
  });
});

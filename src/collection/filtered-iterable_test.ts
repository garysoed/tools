import { assert, TestBase } from '../test-base';
TestBase.setup();

import { ArrayIterable } from './array-iterable';
import { Arrays } from './arrays';
import { FilteredIterable } from './filtered-iterable';


describe('collection.FilteredIterable', () => {
  it('should return the correct iterable', () => {
    let filterFn = (value: number) => {
      return value % 2 === 0;
    };
    let iterable = FilteredIterable.newInstance(ArrayIterable.newInstance([1, 2, 3, 4]), filterFn);
    assert(Arrays.fromIterable(iterable).asArray()).to.equal([2, 4]);
  });
});

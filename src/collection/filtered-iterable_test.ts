import { assert, TestBase } from '../test-base';
TestBase.setup();

import { Arrays } from './arrays';
import { FilteredIterable } from './filtered-iterable';


describe('collection.FilteredIterable', () => {
  it('should return the correct iterable', () => {
    const filterFn = (value: number) => {
      return value % 2 === 0;
    };
    const iterable = FilteredIterable.newInstance([1, 2, 3, 4], filterFn);
    assert(Arrays.fromIterable(iterable).asArray()).to.equal([2, 4]);
  });
});

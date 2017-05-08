import { assert, TestBase } from '../test-base';
TestBase.setup();

import { Iterables } from './iterables';
import { MappedIterable } from './mapped-iterable';


describe('collection.MappedIterable', () => {
  it('should create the correct iterable', () => {
    const iterable = MappedIterable.newInstance(
        [1, 2, 3, 4],
        (value: number) => {
          return value + 1;
        });
    const result: number[] = [];

    Iterables.of(iterable).iterate((value: number) => {
      result.push(value);
    });
    assert(result).to.equal([2, 3, 4, 5]);
  });
});

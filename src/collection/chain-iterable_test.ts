import {TestBase} from '../test-base';
TestBase.setup();

import {ArrayIterable} from './array-iterable';
import {ChainIterable} from './chain-iterable';
import {Iterables} from './iterables';


describe('collection.ChainIterable', () => {
  it('should append the two input elements back to back', () => {
    let first = new ArrayIterable<number>([1, 2, 3]);
    let second = new ArrayIterable<number>([4, 5, 6]);
    let chained = new ChainIterable<number>(first, second);

    let array = [];
    Iterables.of(chained).iterate((value: number) => {
      array.push(value);
    });
    expect(array).toEqual([1, 2, 3, 4, 5, 6]);
  });
});

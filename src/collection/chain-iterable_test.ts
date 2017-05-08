import { assert, TestBase } from '../test-base';
TestBase.setup();

import { Arrays } from './arrays';
import { ChainIterable } from './chain-iterable';


describe('collection.ChainIterable', () => {
  it('should append the two input elements back to back', () => {
    const chained = new ChainIterable<number>([1, 2, 3], [4, 5, 6]);
    assert(Arrays.fromIterable(chained).asArray()).to.equal([1, 2, 3, 4, 5, 6]);
  });
});

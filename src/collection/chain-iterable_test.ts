import {assert, TestBase} from '../test-base';
TestBase.setup();

import {ArrayIterable} from './array-iterable';
import {Arrays} from './arrays';
import {ChainIterable} from './chain-iterable';


describe('collection.ChainIterable', () => {
  it('should append the two input elements back to back', () => {
    let first = new ArrayIterable<number>([1, 2, 3]);
    let second = new ArrayIterable<number>([4, 5, 6]);
    let chained = new ChainIterable<number>(first, second);
    assert(Arrays.fromIterable(chained).asArray()).to.equal([1, 2, 3, 4, 5, 6]);
  });
});

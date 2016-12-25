import {assert, TestBase} from '../test-base';
TestBase.setup();

import {ArrayIterable} from './array-iterable';
import {Arrays} from './arrays';


describe('collection.ArrayIterable', () => {
  it('should iterate with the correct elements', () => {
    let expectedArray = [1, 2, 3, 4];
    let iterable = ArrayIterable.newInstance(expectedArray);
    assert(Arrays.fromIterable(iterable).asArray()).to.equal(expectedArray);
  });
});

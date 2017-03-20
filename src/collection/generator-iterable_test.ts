import { assert, TestBase } from '../test-base';
TestBase.setup();

import { ArrayIterable } from './array-iterable';
import { Arrays } from './arrays';
import { GeneratorIterable } from './generator-iterable';


describe('collection.GeneratorIterable', () => {
  it('should generate the correct elements', () => {
    let expectedElements = [1, 2, 3, 4];
    let iterator = ArrayIterable.newInstance(expectedElements)[Symbol.iterator]();
    let generator = () => {
      return iterator.next();
    };
    let generatorIterable = GeneratorIterable.newInstance(generator);

    assert(Arrays.fromIterable(generatorIterable).asArray()).to.equal(expectedElements);
  });
});

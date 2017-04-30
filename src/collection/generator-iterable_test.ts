import { assert, TestBase } from '../test-base';
TestBase.setup();

import { ArrayIterable } from './array-iterable';
import { Arrays } from './arrays';
import { GeneratorIterable } from './generator-iterable';


describe('collection.GeneratorIterable', () => {
  it('should generate the correct elements', () => {
    const expectedElements = [1, 2, 3, 4];
    const iterator = ArrayIterable.newInstance(expectedElements)[Symbol.iterator]();
    const generator = () => {
      return iterator.next();
    };
    const generatorIterable = GeneratorIterable.newInstance(generator);

    assert(Arrays.fromIterable(generatorIterable).asArray()).to.equal(expectedElements);
  });
});

import {TestBase} from '../test-base';
TestBase.setup();

import {ArrayIterable} from './array-iterable';
import {GeneratorIterable} from './generator-iterable';
import {Iterables} from './iterables';


describe('collection.GeneratorIterable', () => {
  it('should generate the correct elements', () => {
    let expectedElements = [1, 2, 3, 4];
    let iterator = ArrayIterable.newInstance(expectedElements)[Symbol.iterator]();
    let generator = () => {
      return iterator.next();
    };
    let generatorIterable = GeneratorIterable.newInstance(generator);

    let result: number[] = [];
    Iterables.of(generatorIterable)
        .iterate((value: number) => {
          result.push(value);
        });
    expect(result).toEqual(expectedElements);
  });
});

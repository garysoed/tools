import {TestBase} from '../test-base';
TestBase.setup();

import {ArrayIterable} from './array-iterable';
import {Iterables} from './iterables';


describe('collection.ArrayIterable', () => {
  it('should iterate with the correct elements', () => {
    let expectedArray = [1, 2, 3, 4];
    let array = [];
    Iterables.of(ArrayIterable.newInstance(expectedArray))
        .iterate((value: number) => {
          array.push(value);
        });
    expect(array).toEqual(expectedArray);
  });
});

import TestBase from '../test-base';
TestBase.setup();

import {ArrayIterable} from './array-iterable';
import {Arrays} from './arrays';
import {Indexables} from './indexables';


describe('collection.Arrays', () => {
  describe('fromIterable', () => {
    it('should return the correct FluentIndexable', () => {
      let data = [1, 1, 2, 2, 3];
      expect(Arrays.fromIterable(ArrayIterable.newInstance(data)).asArray()).toEqual(data);
    });
  });

  describe('of', () => {
    it('should return the correct FluentIndexable', () => {
      let data = [1, 2, 3];
      expect(Arrays.of(data).asArray()).toEqual(data);
    });
  });
});

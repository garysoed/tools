import {TestBase} from '../test-base';
TestBase.setup();

import {NonIndexables} from './non-indexables';
import {Sets} from './sets';


describe('collection.Sets', () => {
  describe('fromArray', () => {
    it('should return the correct FluentNonIndexable', () => {
      let data = [1, 1, 2, 2, 3];
      spyOn(NonIndexables, 'fromIterable').and.callThrough();

      expect(Sets.fromArray(data).asArray()).toEqual([1, 2, 3]);
      expect(NonIndexables.fromIterable).toHaveBeenCalledWith(new Set(data));
    });
  });

  describe('of', () => {
    it('should return the correct FluentNonIndexable', () => {
      let data = new Set([1, 2, 3]);
      spyOn(NonIndexables, 'fromIterable').and.callThrough();

      expect(Sets.of(data).asArray()).toEqual([1, 2, 3]);
      expect(NonIndexables.fromIterable).toHaveBeenCalledWith(data);
    });
  });
});

import TestBase from '../test-base';
TestBase.setup();

import Maps from './maps';
import Records from './records';


describe('collection.Maps', () => {
  describe('forEach', () => {
    it('should call the function for every entry in the map', () => {
      let map = Records.of({ a: 'a', b: 'b' }).toMap().data;
      let callback = jasmine.createSpy('callback');
      Maps.of(map).forEach(callback);

      expect(callback).toHaveBeenCalledWith('a', 'a');
      expect(callback).toHaveBeenCalledWith('b', 'b');
    });
  });
});

import TestBase from '../test-base';
TestBase.setup();

import Maps from './maps';


describe('collection.Maps', () => {
  describe('forEach', () => {
    it('should call the function for every entry in the map', () => {
      let callback = jasmine.createSpy('callback');
      let map = new Map<string, number>();
      map.set('a', 1);
      map.set('b', 2);
      Maps.of(map).forEach(callback);

      expect(callback).toHaveBeenCalledWith(1, 'a');
      expect(callback).toHaveBeenCalledWith(2, 'b');
    });
  });

  describe('fromArray', () => {
    it('should create the map correctly', () => {
      let map = Maps.fromArray(['1', undefined, 'a']).data;
      expect(map.size).toEqual(2);
      expect(map.get(0)).toEqual('1');
      expect(map.get(2)).toEqual('a');
    });
  });

  describe('fromRecord', () => {
    it('should return the correct map', () => {
      let map = Maps.fromRecord({ a: 1, b: 2 }).data;
      expect(map.size).toEqual(2);
      expect(map.get('a')).toEqual(1);
      expect(map.get('b')).toEqual(2);
    });
  });
});

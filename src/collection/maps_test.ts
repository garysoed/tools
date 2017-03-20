import { assert, TestBase } from '../test-base';
TestBase.setup();

import { Maps } from './maps';


describe('collection.Maps', () => {
  describe('fromArray', () => {
    it('should create the map correctly', () => {
      let record = Maps.fromArray(['1', undefined, 'a', null]).asRecord();
      assert(record).to.equal({'0': '1', '2': 'a', '3': null});
    });
  });

  describe('fromNumericalIndexed', () => {
    it('should create the map correctly', () => {
      let index = <{ [index: number]: string }> {};
      index[2] = 'b';
      index[3] = 'c';
      index[25] = 'z';

      let result = Maps.fromNumericalIndexed<string>(index).asRecord();
      assert(result).to.equal({'2': 'b', '3': 'c', '25': 'z'});
    });
  });

  describe('fromRecord', () => {
    it('should return the correct map', () => {
      let result = Maps.fromRecord({'a': 1, 'b': 2}).asRecord();
      assert(result).to.equal({'a': 1, 'b': 2});
    });
  });
});

import TestBase from '../test-base';
TestBase.setup();

import Asserts from './asserts';
import {Maps} from '../collection/maps';


describe('assert.MapAsserts', () => {
  describe('to.containKey', () => {
    it('should not throw error if the map contains the key', () => {
      expect(() => {
        Asserts.map(Maps.fromRecord({'key': 1, 'other': 2}).asMap()).to.containKey('key')
            .orThrows('error');
      }).not.toThrow();
    });

    it('should throw error if the map does not contain the key', () => {
      expect(() => {
        Asserts.map(Maps.fromRecord({}).asMap()).to.containKey('key').orThrows('error');
      }).toThrowError('error');
    });
  });

  describe('toNot.containKey', () => {
    it('should throw error if the map contains the key', () => {
      expect(() => {
        Asserts.map(Maps.fromRecord({'key': 1, 'other': 2}).asMap()).toNot.containKey('key')
            .orThrows('error');
      }).toThrowError('error');
    });

    it('should not throw error if the map does not contain the key', () => {
      expect(() => {
        Asserts.map(Maps.fromRecord({}).asMap()).toNot.containKey('key').orThrows('error');
      }).not.toThrow();
    });
  });
});

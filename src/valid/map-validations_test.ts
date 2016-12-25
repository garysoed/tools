import {assert, TestBase} from '../test-base';
TestBase.setup();

import {Maps} from '../collection/maps';
import {Stringify} from '../data/stringify';

import {Validate} from './validate';


describe('valid.MapValidations', () => {
  describe('to.containKey', () => {
    it('should pass if the map contains the key', () => {
      let map = Maps.fromRecord({'key': 1, 'other': 2}).asMap();
      let result = Validate.map(map).to.containKey('key');
      assert(result.isValid()).to.beTrue();
    });

    it('should not pass if the map does not contain the key', () => {
      let map = Maps.fromRecord({}).asMap();
      let result = Validate.map(map).to.containKey('key');
      assert(result.isValid()).to.beFalse();
      assert(result.getErrorMessage()).to.match(/to contain key "key"/);
    });
  });

  describe('toNot.containKey', () => {
    it('should not pass if the map contains the key', () => {
      let map = Maps.fromRecord({'key': 1, 'other': 2}).asMap();
      let result = Validate.map(map).toNot.containKey('key');
      assert(result.isValid()).to.beFalse();
      assert(result.getErrorMessage()).to.match(/to not contain key "key"/);
    });

    it('should pass if the map does not contain the key', () => {
      let map = Maps.fromRecord({}).asMap();
      let result = Validate.map(map).toNot.containKey('key');
      assert(result.isValid()).to.beTrue();
    });
  });

  describe('getValueAsString', () => {
    it('should return the correct string', () => {
      let record = {'a': 1, 'b': 2};
      let map = Maps.fromRecord(record).asMap();
      assert(Validate.map(map).to.getValueAsString()).to.equal(Stringify.toString(record));
    });
  });
});

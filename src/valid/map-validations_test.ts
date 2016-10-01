import {assert, TestBase} from '../test-base';
TestBase.setup();

import {Validate} from './validate';
import {Maps} from '../collection/maps';


describe('valid.MapValidations', () => {
  describe('to.containKey', () => {
    it('should pass if the map contains the key', () => {
      let map = Maps.fromRecord({'key': 1, 'other': 2}).asMap();
      let result = Validate.map(map).to.containKey('key');
      assert(result.getPasses()).to.beTrue();
    });

    it('should not pass if the map does not contain the key', () => {
      let map = Maps.fromRecord({}).asMap();
      let result = Validate.map(map).to.containKey('key');
      assert(result.getPasses()).to.beFalse();
      assert(result.getErrorMessage()).to.match(/to contain key "key"/);
    });
  });

  describe('toNot.containKey', () => {
    it('should not pass if the map contains the key', () => {
      let map = Maps.fromRecord({'key': 1, 'other': 2}).asMap();
      let result = Validate.map(map).toNot.containKey('key');
      assert(result.getPasses()).to.beFalse();
      assert(result.getErrorMessage()).to.match(/to not contain key "key"/);
    });

    it('should pass if the map does not contain the key', () => {
      let map = Maps.fromRecord({}).asMap();
      let result = Validate.map(map).toNot.containKey('key');
      assert(result.getPasses()).to.beTrue();
    });
  });
});

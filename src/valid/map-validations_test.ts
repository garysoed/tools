import {TestBase} from '../test-base';
TestBase.setup();

import {Validate} from './validate';
import {Maps} from '../collection/maps';


describe('valid.MapValidations', () => {
  describe('to.containKey', () => {
    it('should pass if the map contains the key', () => {
      let map = Maps.fromRecord({'key': 1, 'other': 2}).asMap();
      let result = Validate.map(map).to.containKey('key');
      expect(result.passes).toEqual(true);
    });

    it('should not pass if the map does not contain the key', () => {
      let map = Maps.fromRecord({}).asMap();
      let result = Validate.map(map).to.containKey('key');
      expect(result.passes).toEqual(false);
      expect(result.errorMessage).toEqual(jasmine.stringMatching(/to contain key "key"/));
    });
  });

  describe('toNot.containKey', () => {
    it('should not pass if the map contains the key', () => {
      let map = Maps.fromRecord({'key': 1, 'other': 2}).asMap();
      let result = Validate.map(map).toNot.containKey('key');
      expect(result.passes).toEqual(false);
      expect(result.errorMessage).toEqual(jasmine.stringMatching(/to not contain key "key"/));
    });

    it('should pass if the map does not contain the key', () => {
      let map = Maps.fromRecord({}).asMap();
      let result = Validate.map(map).toNot.containKey('key');
      expect(result.passes).toEqual(true);
    });
  });
});

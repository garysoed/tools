import TestBase from '../test-base';
TestBase.setup();

import AssertResolution from './assert-resolution';


describe('assert.AssertResolution', () => {
  describe('orThrows', () => {
    it('should throw error with the given message if the assertion did not pass and not reversed',
        () => {
          let message = 'message';
          let resolution = new AssertResolution(false, false);
          expect(() => {
            resolution.orThrows(message);
          }).toThrowError(message);
        });

    it('should not throw if the assertion passes and not reversed', () => {
      let resolution = new AssertResolution(true, false);
      expect(() => {
        resolution.orThrows('message');
      }).not.toThrow();
    });

    it('should not throw if the assertion did not pass and reversed',
        () => {
          let resolution = new AssertResolution(false, true);
          expect(() => {
            resolution.orThrows('message');
          }).not.toThrow();
        });

    it('should throw error with the given message if the assertion passes and reversed', () => {
      let message = 'message';
      let resolution = new AssertResolution(true, true);
      expect(() => {
        resolution.orThrows(message);
      }).toThrowError(message);
    });
  });
});
